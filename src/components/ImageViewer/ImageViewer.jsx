import { Image } from 'antd';
import React, { useState, useEffect } from 'react';
import { URL } from '../../lib/services';

const ImageViewer = ({ flag = false, setFlag, url = '' }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            if (url) {
                try {
                    const response = await fetch(`${URL}/file/v1/image/${url}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': localStorage.getItem('drNote_token') || '',
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch image');
                    }

                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    setImageUrl(objectUrl);
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
        };

        fetchImage();
    }, [url]);

    return (
        <>
            {flag && (
                <Image.PreviewGroup
                    preview={{
                        visible: flag,
                        onVisibleChange: (visible) => setFlag(visible),
                    }}
                >
                    <Image
                        src={imageUrl}
                        style={{ display: "none" }}
                    />
                </Image.PreviewGroup>
            )}
        </>
    );
};

export default ImageViewer;