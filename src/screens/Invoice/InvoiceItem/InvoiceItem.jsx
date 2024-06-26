import React from "react";
import { Button, Popconfirm, Space, message, Avatar } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./InvoiceItem.css";
import medical from "../../../assets/med.svg";

const InvoiceItem = ({ item, onEdit, onDelete }) => {
  function formatDate(item) {
    const createdAt = item.createdAt;
    const date = new Date(createdAt);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  const formattedDate = formatDate(item);
  return (
    <div className="Invoice-item">
      <div className="item-name">
        <Avatar style={{ background: "#7265e6" }}>
          {item.patient?.name.substr(0, 1).toUpperCase()}
        </Avatar>
        <div className="name-info">
          <Space direction="vertical" size={4}>
            <span>{item.patient?.name}</span>
            <small>{formattedDate}</small>
          </Space>
        </div>
      </div>
      <div className="item-service">
        <span className="text-[18px] font-bold flex "><img src={medical}/>{item.service}</span>
      </div>
      <div className="item-amount">
        <span className="text-[18px] font-bold ">
          {item.amount}
          <span className="text-[12px] font-light mt-2 ml-2 text-gray-600">
            IQD
          </span>
        </span>
      </div>
      <div className="item-actions">
        <Button
          onClick={() => onEdit(item)}
          type="text"
          icon={<EditOutlined />}
        />
        <Popconfirm
          title="Delete the Invoice"
          onConfirm={onDelete}
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
