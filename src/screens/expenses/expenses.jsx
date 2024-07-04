import React, { useState } from "react";
import { Button, List, Spin, message, Empty } from "antd";
import ExpenseForm from "./expensesForm/expensesForm";
import ExpenseItem from "./expensesItem/expensesItem";
import ExpenseItemMob from "./expensesItemMob/expensesItemMob";
import { useAppStore } from "../../lib/store";
import { useQuery } from "react-query";
import { apiCall } from "../../lib/services";
import "./expenses.css";
import { UserAddOutlined } from "@ant-design/icons";
import { useMobileDetect } from "../../hooks/mobileDetect";

const ExpensesScreen = () => {
  const { expenses, setExpenses } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const { isMobile } = useMobileDetect();

  const fetchExpenses = async () => {
    const response = await apiCall({
      url: "expenses/v1/all",
    });
    return response;
  };

  const { data, isLoading, refetch } = useQuery("expenses", fetchExpenses, {
    onSuccess: (data) => {
      setExpenses(data);
    },
    onError: (error) => {
      message.error("Failed to fetch expenses");
    },
  });

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (selectedExpense) {
        await apiCall({
          url: `expenses/v1/edit/${selectedExpense.id}`,
          method: "PUT",
          data: expenseData,
        });
        setExpenses(
          expenses.map((exp) =>
            exp.id === selectedExpense.id
              ? { ...expenseData, id: selectedExpense.id }
              : exp
          )
        );
      } else {
        const newExpense = await apiCall({
          url: "expenses/v1/create",
          method: "POST",
          data: expenseData,
        });
        setExpenses([...expenses, newExpense]);
      }
      setShowForm(false);
      message.success("Expense saved successfully");
    } catch (error) {
      message.error("Failed to save expense");
    }
  };

  const handleDeleteExpense = async (expense) => {
    try {
      await apiCall({
        url: `expenses/v1/delete/${expense.id}`,
        method: "DELETE",
      });
      setExpenses(expenses.filter((exp) => exp.id !== expense.id));
      message.success("Expense deleted successfully");
    } catch (error) {
      message.error("Failed to delete expense");
    }
  };

  const ExpenseCard = isMobile ? ExpenseItemMob : ExpenseItem;

  return (
    <div className="page p-0 sm:p-[24px]">
      {!isMobile && (
        <div className="flex justify-between align-center text mx-5 my-6">
          <p className="">Expense List</p>
          <Button size="large" type="link" onClick={handleAddExpense}>
            + Add Expense
          </Button>
        </div>
      )}

      <div className="list mt-0 sm:mt-[12px]">
        <Spin tip="Loading..." spinning={isLoading}>
          {expenses.length > 0 ? (
            <List
              dataSource={expenses}
              renderItem={(item) => (
                <div className="expense-card">
                  <ExpenseCard
                    expense={item}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                </div>
              )}
            />
          ) : (
            <Empty
              style={{ padding: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>
      </div>
      <button
        onClick={handleAddExpense}
        className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-[#2c24ff] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
      >
        <UserAddOutlined className="text-[22px]" />
      </button>
      {showForm && (
        <ExpenseForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSaveExpense}
          expense={selectedExpense}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default ExpensesScreen;
