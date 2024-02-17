import React from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./drugItem.css";

export const DrugItem = ({ item, onRemove }) => {
  return (
    <div className="drug-item">
      <div className="item-drug">
        <span style={{ fontWeight: "bold" }}>{item.name}</span>
      </div>
      <div className="item-note">
        <span style={{ fontSize: 12 }}>{item.note || "..."}</span>
      </div>
      <div className="item-actions">
        <span>
          <Button
            style={{ marginRight: -4 }}
            danger
            type="text"
            onClick={() => onRemove(item.id)}
            icon={<CloseOutlined />}
          />
        </span>
      </div>
    </div>
  );
};
