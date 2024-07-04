import React, { useState } from "react";
import { Button, message, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation } from "react-query";
import { apiCall } from "../../../lib/services";
import { useAppStore } from "../../../lib/store";
import { Sheet } from "react-modal-sheet";
import "./expensesItemMob.css";

const ExpenseItemMob = ({ expense, onEdit }) => {
  const [isActions, setIsActions] = useState(false);
  const { setExpenses } = useAppStore();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      apiCall({ url: `expenses/v1/delete/${expense.id}`, method: "DELETE" }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      setExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
      setIsActions(false);
    },
    onError: () => message.error("Error !"),
  });

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const formattedDate = (date) => {
    const newDate = new Date(date);

    const day = String(newDate.getDate()).padStart(2, "0");
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const year = newDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleViewNote = () => {
    message.info(expense.note || "No note available");
  };

  return (
    <>
      <div className="expense-item-mob">
        <div className="item-name">
          <div className="name-info">
            <Space direction="vertical" size={4}>
              <span className="text-[16px]">{capitalizeFirstLetter(expense.name)}</span>
              <small className="text-[#666]">{formattedDate(expense.date)}</small>
            </Space>
          </div>
        </div>
        <div className="item-amount">
          {expense.amount}
          <span className="text-[10px] mt-1 ml-1 text-gray-600">IQD</span>
        </div>
        <div className="item-new">
          <Space>
            <Button
              type="text"
              icon={<MoreOutlined size={22} />}
              onClick={() => setIsActions(true)}
            />
          </Space>
        </div>
      </div>
      <Sheet
        isOpen={isActions}
        onClose={() => setIsActions(false)}
        detent="content-height"
      >
        <Sheet.Container className="overflow-hidden">
          <Sheet.Content>
            <div className="flex flex-col overflow-hidden">
              <button
                onClick={() => mutate()}
                className="p-[20px] border border-b-[#eee] transition-all active:opacity-30 text-[#ff0000] text-[18px]"
              >
                Delete Expense
              </button>
              <button
                className="p-[20px] border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
                onClick={() => {
                  setIsActions(false);
                  onEdit(expense);
                }}
              >
                Edit Expense
              </button>
              <button
                onClick={handleViewNote}
                className="p-[20px] border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
              >
                View Note
              </button>
              <button
                onClick={() => setIsActions(false)}
                className="p-[20px] m-[20px] rounded-[12px] bg-[#f6f6f6] transition-all active:opacity-30 text-[18px]"
              >
                Cancel
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setIsActions(false)} />
      </Sheet>
    </>
  );
};

export default ExpenseItemMob;
