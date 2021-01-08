import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { DrugStore } from '../../store/drugStore';

const InputFiled = (label, input) => (
    <div className="text-input">
        <p style={{ marginBottom: 8 }}>{label}</p>
        <div style={{ display: "flex" }}>{input}</div>
    </div>
);

const colors = ['#008891', '#ef4f4f', '#ff9a00', '#1fab89', '#d72323', '#0c056d'];

export const DrugForm = ({ isModalVisible, onSubmit, loading }) => {
    let {
        name,
        color,
        setName,
        setColor
    } = DrugStore();

    return (
        <div>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={onSubmit}
                loading={loading}>
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
                                    suffix={<UserOutlined />}
                                />
                            )}
                        </Col>
                        {/* <Col span={24}>
                        {InputFiled(
                                "Prescption Name",
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    size="large"
                                    placeholder="amoxicillin"
                                    suffix={<UserOutlined />}
                                />
                            )}
                        </Col> */}
                    </Row>
                </div>
            </Modal>
        </div>
    )
}