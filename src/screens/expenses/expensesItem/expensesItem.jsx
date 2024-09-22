import React, { useState } from "react";
import { Button, Popconfirm, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./expensesItem.css";

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const [showNoteModal, setShowNoteModal] = useState(false); // State to control modal visibility

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formattedDate = (date) => {
    const createdAt = date;
    const newDate = new Date(createdAt);

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = newDate.getFullYear();

    return `${day-1}/${month}/${year}`;
  };

  const showModal = () => {
    setShowNoteModal(true);
  };

  const handleModalCancel = () => {
    setShowNoteModal(false);
  };

  const moneyFormat = () => {
    return expense.amount.toLocaleString()
  }
  return (
    <div className="Expense-item">
      <div className="item-name">
        <Space direction="vertical" size={4}>
          <span className="font-bold text-[18px]">
            {capitalizeFirstLetter(expense.name)}
          </span>
          <small>{formattedDate(expense.date)}</small>
        </Space>
      </div>
      <div className="note w-[100px]">
        {expense.note && (
          <Button type="link" onClick={showModal}>
            View Note
          </Button>
        )}
      </div>
      <div className="item-amount w-[100px]">
        <span className="text-[18px] font-bold">
          {moneyFormat()}
          <span className="text-[10px] mt-1 ml-1 text-gray-600">IQD</span>
        </span>
      </div>
      <div className="item-actions w-[100px]">
        <Button onClick={() => onEdit(expense)} type="text" icon={<EditOutlined />} />
        <Popconfirm
          title="Delete the Expense"
          onConfirm={() => onDelete(expense)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
      <Modal
        title="Expense Note"
        open={showNoteModal}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Close
          </Button>,
        ]}
      >
        <p>{expense.note}</p>
      </Modal>
    </div>
  );
};

export default ExpenseItem;
