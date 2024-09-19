import { Image } from 'antd'
import React from 'react'

const ImageViewer = ({ flag = false, setFlag, url = '' }) => {
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
                        src={`https://ucarecdn.com/${url}/`}
                        style={{ display: "none" }}
                    />
                </Image.PreviewGroup>
            )}
        </>
    )
}

export default ImageViewer