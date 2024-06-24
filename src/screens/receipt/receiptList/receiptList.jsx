import React, { useEffect, useState } from "react";
import { List } from "antd";

const ReceiptList = () => {
  const [receipts, setReceipts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    setReceipts(savedReceipts);
  }, []);

  const handleSave = () => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    setReceipts(savedReceipts);
  };

  return (
    <div>
      <List
        dataSource={receipts}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.patient.name}
              description={`Service: ${item.service}, Amount: ${item.amount}, Date: ${item.date}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ReceiptList;
