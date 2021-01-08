import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const InputFiled = (label, input) => (
    <div className="text-input">
        <p style={{ marginBottom: 8 }}>{label}</p>
        <div style={{ display: "flex" }}>{input}</div>
    </div>
);

export const DrugForm = ({ isModalVisible, onSubmit, loading }) => {
    let {
        name,
        color,
        setName,
        setColor
    } = PatientStore();

    return(
        <div>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    )
}