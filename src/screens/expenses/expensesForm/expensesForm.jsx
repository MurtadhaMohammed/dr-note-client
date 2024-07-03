import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { apiCall } from '../../../lib/services'; // Adjust the import path as necessary

const ExpenseForm = ({ visible, onClose, onSave, expense }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      form.setFieldsValue({
        ...expense,
        date: dayjs(expense.date),
      });
    } else {
      form.resetFields();
    }
  }, [expense, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const expenseData = {
        ...values,
        date: values.date,
      };
      setLoading(true);
      if (expense) {
        await apiCall({
          url: `expenses/v1/edit/${expense.id}`,
          method: 'PUT',
          data: expenseData,
        });
      } else {
        await apiCall({
          url: 'expenses/v1/create',
          method: 'POST',
          data: expenseData,
        });
      }
      onSave(expenseData);
      form.resetFields();
      setLoading(false);
    } catch (error) {
      console.error('Failed to save expense:', error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={expense ? "Edit Expense" : "Add Expense"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the Name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="note"
          label="Note"
          rules={[{ required: false, message: 'Please input the Note!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select the date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
