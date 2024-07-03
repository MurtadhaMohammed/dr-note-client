import React from "react";
import { Button, Popconfirm, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./expensesItem.css";

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
//   const formatDate = (date) => {
//     const formattedDate = new Date(date);
//     const day = String(formattedDate.getDate()).padStart(2, "0");
//     const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
//     const year = formattedDate.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="Expense-item">
      <div className="item-name">
        <Space direction="vertical" size={4}>
          <span className="font-bold text-[18px]">
            {capitalizeFirstLetter(expense.name)}
          </span>
          <small>{(expense.date)}</small>
        </Space>
      </div>
      <div className="note">
        <span>{expense.note}</span>
      </div>
      <div className="item-amount">
        <span className="text-[18px] font-bold">
          {expense.amount}
          <span className="text-[10px] mt-1 ml-1 text-gray-600">IQD</span>
        </span>
      </div>
      <div className="item-actions">
        <Button
          onClick={() => onEdit(expense)}
          type="text"
          icon={<EditOutlined />}
        />
        <Popconfirm
          title="Delete the Expense"
          onConfirm={() => onDelete(expense)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </div>
    </div>
  );
};

export default ExpenseItem;
