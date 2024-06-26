import React from "react";
import { Button, Popconfirm, Space, message, Avatar } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./InvoiceItem.css";
import { apiCall } from "../../../lib/services";

const InvoiceItem = ({ item, onEdit, onDelete }) => {
  const handleDelete = async () => {
    try {
      await apiCall({
        url: `invoice/v1/delete/${item.id}`,
        method: "DELETE",
      });
      message.success("Deleted Successfully.");
      onDelete();
    } catch (error) {
      message.error("Failed to delete the invoice.");
    }
  };

  return (
    <div className="Invoice-item">
      <div className="item-name">
        <Avatar style={{ background: "#7265e6" }}>
          {item.patient?.name.substr(0, 1).toUpperCase()}
        </Avatar>
        <div className="name-info">
          <Space direction="vertical" size={4}>
            <span>{item.patient?.name}</span>
            <small>{item.date}</small>
          </Space>
        </div>
      </div>
      <div className="item-service">
        <span>{item.service}</span>
      </div>
      <div className="item-amount">
        <span>${item.amount}</span>
      </div>
      <div className="item-actions">
        <Button onClick={() => onEdit(item)} type="text" icon={<EditOutlined />} />
        <Popconfirm
          title="Delete the Invoice"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    </div>
  );
};

export default InvoiceItem;
