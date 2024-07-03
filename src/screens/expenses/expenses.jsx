import React, { useState, useEffect } from 'react';
import { Button, List, Typography, Divider, Spin, message } from 'antd';
import ExpenseForm from './expensesForm/expensesForm';
import ExpenseItem from './expensesItem/expensesItem';
import { useAppStore } from '../../lib/store';
import { useQuery } from 'react-query';
import { apiCall } from '../../lib/services';

const ExpensesScreen = () => {
  const { expenses, setExpenses } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    const response = await apiCall({
      url: 'expenses/v1/all',
    });
    return response;
  };

  const { data, isLoading, refetch } = useQuery('expenses', fetchExpenses, {
    onSuccess: (data) => {
      setExpenses(data);
    },
    onError: (error) => {
      message.error("Failed to fetch expenses");
    }
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
          method: 'PUT',
          data: expenseData,
        });
        setExpenses(expenses.map(exp => exp.id === selectedExpense.id ? { ...expenseData, id: selectedExpense.id } : exp));
      } else {
        const newExpense = await apiCall({
          url: 'expenses/v1/create',
          method: 'POST',
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
        method: 'DELETE',
      });
      setExpenses(expenses.filter(exp => exp.id !== expense.id));
      message.success("Expense deleted successfully");
    } catch (error) {
      message.error("Failed to delete expense");
    }
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className="expenses-screen">
      <div className='flex justify-between align-center mx-5 my-6'>
        <Typography.Title level={2}>Expenses</Typography.Title>
        <Button size="large" type="link" onClick={handleAddExpense}>
          + Add Expense
        </Button>
      </div>
      <Divider />
      <List
        dataSource={expenses}
        renderItem={item => (
          <ExpenseItem
            expense={item}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        )}
      />
      {showForm && (
        <ExpenseForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSaveExpense}
          expense={selectedExpense}
        />
      )}
    </div>
  );
};

export default ExpensesScreen;
