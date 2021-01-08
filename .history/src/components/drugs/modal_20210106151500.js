import React, { useState } from 'react';
import { Modal, Button, Input, Spin, Drawer, Row, Col } from 'antd';
import { DrugStore } from '../../store/drugStore';

const InputFiled = (label, input) => (
    <div className="text-input">
        <p style={{ marginBottom: 8 }}>{label}</p>
        <div style={{ display: "flex" }}>{input}</div>
    </div>
);

export const DrugForm = ({ visible,onClose, onSubmit, loading }) => {
 

    let {
        name,
        color,
        setName,
        setColor
    } = DrugStore();

    // const handleCancel = () => {
    //     // visible=false;
    //     console.log("close");
    //     console.log(randomColor(colors));
    // };
    return (
        <div>
            <Modal title="Add Prescption" visible={visible} onOk={onSubmit}
                loading={loading} onCancel={onClose}>
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
                    {/* <input type="hidden"  value={color} ref={x => {setValue(randomColor(colors))}} /> */}
                </div>
            </Modal>
        </div>
    )
}