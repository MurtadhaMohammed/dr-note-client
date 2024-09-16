import { Button, InputNumber, Modal, Select, Space } from "antd";
import styles from "./racheta.module.css";
import { useAppStore } from "../../lib/store";
import getAge from "get-age";
import { useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";
import printJS from "print-js";

export const RachetaModal = () => {
  const { racheta, setRacheta } = useAppStore();
  const [header, setHeader] = useState(100);
  const [size, setSize] = useState("md");

  const print = () => {
    printJS({
      printable: "printJS-racheta",
      type: "html",
      scanStyles: false,
      header: null,
    });
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
      title="Print Racheta"
      open={racheta?.open}
      onCancel={() => setRacheta({ open: false, data: null })}
      footer={
        <div className={styles.footer}>
          <Button icon={<PrinterOutlined />} type="primary" onClick={print}>
            Print
          </Button>
          <Space>
            <Select className="w-24 h-9 gender text-start" popupMatchSelectWidth={false} placeholder="Size" size="40" value={size} onChange={setSize}>
              <Select.Option value="sm">Small</Select.Option>
              <Select.Option value="md">Medium</Select.Option>
              <Select.Option value="lg">Larg</Select.Option>
            </Select>
            <InputNumber max={250} value={header} onChange={setHeader} />
          </Space>
        </div>
      }
    >
      <div
        id="printJS-racheta"
        className={styles.racheta}
        style={{
          minHeight: "500px",
          overflow: "hidden",
          width: "100% !important",
        }}
      >
        <section
          style={{
            height: header,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          className={styles.raHeader}
        >
          <span style={{ display: "none" }}>HEADER SPACE</span>
        </section>
        <section className={styles.raContent}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: fontSize[size],
            }}
          >
            <span>
              Name: <b>{racheta?.data?.patient?.name}</b>
            </span>
            <span>Age: {getAge(racheta?.data?.patient?.birthDate) || 0}</span>
          </div>
          <div style={{ fontSize: fontSize[size] }}>
            <br /> <br />
            <h4>RX : </h4>
            <ul>
              {racheta?.data?.visit?.drugs?.map((el) => (
                <li>
                  <b>{el?.name}</b> {el?.note ? " - " + el?.note : ""}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Modal>
  );
};
