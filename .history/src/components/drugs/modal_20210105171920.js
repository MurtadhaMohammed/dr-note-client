import React, { useState } from 'react';
import { Modal, Button } from 'antd';

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
    } = PatientStore();

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
                        <Col span={24}>
                            {InputFiled(
                                "Date of Birth",
                                <DatePicker
                                    value={age}
                                    onChange={(val) => setAge(val)}
                                    style={{ width: "100%" }}
                                    size="large"
                                    placeholder="Example 1998/6/30"
                                //suffix={<ScheduleOutlined />}
                                />
                            )}
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}