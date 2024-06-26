import React, { useState } from "react";
import { Button, Popconfirm, Space, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import InvoicePrint from "../../../components/InvoicePrint/invoicePrint"; // Import the InvoicePrint component
import "./invoiceItemMob.css";

const InvoiceItemMob = ({ item, onEdit, onDelete }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const formatDate = (item) => {
    const createdAt = item.createdAt;
    const date = new Date(createdAt);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(item);

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  return (
    <>
      <div className="invoice-item-mob">
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
        <div className="item-details">
          <div className="item-service">
            <span>{item.service}</span>
          </div>
          <div className="item-amount">
            <span>
              {item.amount}
              <span className="text-gray-600 ml-2">IQD</span>
            </span>
          </div>
        </div>
        <div className="item-actions">
          <Button onClick={() => onEdit(item)} type="text" icon={<EditOutlined />} />
          <Popconfirm
            title="Delete the Invoice"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button onClick={handlePrint} type="text" icon={<PrinterOutlined />} />
        </div>
      </div>
      <InvoicePrint
        invoice={item}
        isOpen={isPrintModalOpen}
        onClose={handleClosePrintModal}
      />
    </>
  );
};

export default InvoiceItemMob;
