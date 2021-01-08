import React, { useState } from 'react';
import { Modal, Button, Input, Spin, Drawer, Row, Col } from 'antd';
import { DrugStore } from '../../store/drugStore';

const InputFiled = (label, input) => (
    <div className="text-input">
        <p style={{ marginBottom: 8 }}>{label}</p>
        <div style={{ display: "flex" }}>{input}</div>
    </div>
);

const colors = ['#008891', '#ef4f4f', '#ff9a00', '#1fab89', '#d72323', '#0c056d'];

export const DrugForm = ({ visible, onSubmit, loading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

    let {
        name,
        color,
        setName,
        setColor
    } = DrugStore();

    const showModal = () => {
        setIsModalVisible(visible);
      };

    const handleCancel = () => {
        setIsModalVisible(false)
        // console.log("close")
    };
    return (
        <div>
            <Modal title="Add Prescption" visible={visible} onOk={onSubmit}
                loading={loading} onCancel={handleCancel}>
                <div>
                    <Row gutter={[25, 25]}>
                        <Col span={24}>
                            {InputFiled(
                                "Prescption Name",
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    size="large"
                                    placeholder="amoxicillin"
                                />
                            )}
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}