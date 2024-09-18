import React, { useState, useEffect } from 'react';
import { Modal, Drawer, Form, Input, InputNumber, DatePicker,Button } from 'antd';
import dayjs from 'dayjs';
import { apiCall } from '../../../lib/services';
import { useMobileDetect } from "../../../hooks/mobileDetect";

const ExpenseForm = ({ visible, onClose, onSave, expense }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isMobile } = useMobileDetect();

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
        date: values.date.format("YYYY-MM-DD")
      };
      setLoading(true);
      await onSave(expenseData);
      form.resetFields();
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Failed to save expense:', error);
      setLoading(false);
    }
};


  const formContent = (
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
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
    </Form>
  );

  return isMobile ? (
    <Drawer
      title={expense ? "Edit Expense" : "Add Expense"}
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleOk} type="primary" loading={loading}>
            {expense ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      {formContent}
    </Drawer>
  ) : (
    <Modal
      title={expense ? "Edit Expense" : "Add Expense"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      width={400}
      centered
      confirmLoading={loading}
    >
      {formContent}
    </Modal>
  );
};

export default ExpenseForm;
