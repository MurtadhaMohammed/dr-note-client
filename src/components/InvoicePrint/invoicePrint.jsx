import React, { useState } from "react";
import { Button, Modal, Space, Typography ,Select} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import printJS from "print-js";
import dayjs from "dayjs";
import styles from "./invoicePrint.module.css";

const InvoicePrint = ({ invoice, isOpen, onClose }) => {
  const [size, setSize] = useState("md");

  const print = () => {
    printJS({
      printable: "printJS-invoice",
      type: "html",
      scanStyles: false,
      header: null,
    });
  };

  const formatDate = (date) => {
    const d = dayjs(date);
    return `${d.format("DD")}/${d.format("MM")}/${d.format("YYYY")}`;
  };

  const fontSize = {
    md: 16,
    lg: 18,
    sm: 14,
  };

  return (
    <Modal
      centered
      width={480}
      title="Print Invoice"
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className={styles.footer}>
          <Button icon={<PrinterOutlined />} type="primary" onClick={print}>
            Print
          </Button>
          <Space>
            <Select placeholder="Size" value={size} onChange={setSize}>
              <Select.Option value="sm">Small</Select.Option>
              <Select.Option value="md">Medium</Select.Option>
              <Select.Option value="lg">Large</Select.Option>
            </Select>
          </Space>
        </div>
      }
    >
      <div
        id="printJS-invoice"
        className={styles.invoice}
        style={{
          minHeight: "500px",
          overflow: "hidden",
          width: "100% !important",
        }}
      >
        <section className={styles.header}>
          <Typography.Title level={4}>Invoice</Typography.Title>
        </section>
        <section className={styles.content}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              fontSize: fontSize[size],
            }}
          >
            <div>
              <span>Name: <b>{invoice?.patient?.name}</b></span>
            </div>
            <div>
              <span>Phone: <b>{invoice?.patient?.phone}</b></span>
            </div>
            <div>
              <span>Service: <b>{invoice?.service}</b></span>
            </div>
            <div>
              <span>Amount: <b>{invoice?.amount}</b></span>
            </div>
            <div>
              <span>Date: <b>{formatDate(invoice?.createdAt)}</b></span>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default InvoicePrint;
