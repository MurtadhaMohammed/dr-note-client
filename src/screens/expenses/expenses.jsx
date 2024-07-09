import React, { useState, useMemo, useEffect } from "react";
import { Button, List, Spin, message, Empty, Select , Divider } from "antd";
import ExpenseForm from "./expensesForm/expensesForm";
import ExpenseItem from "./expensesItem/expensesItem";
import ExpenseItemMob from "./expensesItemMob/expensesItemMob";
import { useAppStore } from "../../lib/store";
import { useInfiniteQuery } from "react-query";
import { apiCall } from "../../lib/services";
import "./expenses.css";
import { UserAddOutlined } from "@ant-design/icons";
import { useMobileDetect } from "../../hooks/mobileDetect";

const { Option } = Select;

const ExpensesScreen = () => {
  const { setExpenses, querySearch } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [dateRange, setDateRange] = useState("1");
  const { isMobile } = useMobileDetect();
  const pageSize = 10;

  const searchValue = querySearch?.key === "expenses" ? querySearch?.value : "";

  const fetchExpenses = async ({ pageParam = 0 }) => {
    const response = await apiCall({
      url: `expenses/v1/all?q=${searchValue}&range=${dateRange}&take=${pageSize}&skip=${pageParam}`,
    });
    return { data: response, nextCursor: pageParam + pageSize };
  };

  const { data, isLoading, refetch } = useInfiniteQuery(
    ["expenses", searchValue, dateRange],
    fetchExpenses,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page.data),
        hasNext: data.pages.findIndex((el) => el.data.length === 0) === -1,
      }),
      onSuccess: (data) => {
        setExpenses(data.pages.flatMap((page) => page.data));
      },
      onError: () => {
        message.error("Failed to fetch expenses");
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [dateRange]);

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
        setExpenses((prev) =>
          prev.map((exp) =>
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
        setExpenses((prev) => [...prev, newExpense]);
      }
      setShowForm(false);
      message.success("Expense saved successfully");
      refetch();
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
      setExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
      message.success("Expense deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete expense");
    }
  };

  const filteredData = useMemo(() => {
    if (!querySearch?.value) {
      return data?.pages || [];
    }
    return (data?.pages || []).filter((expense) =>
      expense.name.toLowerCase().includes(querySearch.value.toLowerCase())
    );
  }, [data, querySearch]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((total, expense) => total + expense.amount, 0).toLocaleString();
  }, [filteredData]);
  const ExpenseCard = isMobile ? ExpenseItemMob : ExpenseItem;

  return (
    <div className="page p-0 sm:p-[24px]">
      {!isMobile && (
        <div className="flex align-center justify-between mx-2 my-4">
          <div className="flex">
            {filteredData.length > 0 && (
              <div className="total-amount">
                <p className="total">
                  Total Expenses: <span className="amount ml-1">{totalAmount}</span>
                  <span className="text-[13px] font-bold mt-1 ml-1 text-gray-600">
                    IQD
                  </span>
                  <Divider type="vertical" />
                  </p>
              </div>
            )}
            <div className="py-[7px]">
              <Select
                defaultValue="1"
                variant="borderless"
                onChange={(value) => setDateRange(value)}
              >
                <Option value="1">This Day</Option>
                <Option value="2">Last Week</Option>
                <Option value="3">All Time</Option>
              </Select>
            </div>
          </div>
          <Button size="large" type="link" onClick={handleAddExpense}>
            + Add Expense
          </Button>
        </div>
      )}

      <div className="list mt-0 sm:mt-[12px]">
        <Spin tip="Loading..." spinning={isLoading}>
          {filteredData.length > 0 ? (
            <List
              dataSource={filteredData}
              renderItem={(item) => (
                <div className="expense-card" key={item.id}>
                  <ExpenseCard
                    expense={item}
                    onEdit={handleEditExpense}
                    onDelete={() => handleDeleteExpense(item)}
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
