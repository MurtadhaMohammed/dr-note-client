import React from "react";
import { Button } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt, FaCopy } from "react-icons/fa";
import Avatar from "antd/lib/avatar/avatar";

export const FileItem = ({ item }) => {
  return (
    <div className="file-item">
      <div className="file-info">
        <span className={`fiv-viv fiv-icon-${item.type}`}></span>
        <div className="file-text">
          <span>{item.title}</span>
          <small>{item.date}</small>
        </div>
      </div>
      <Button
        style={{ marginRight: -4 }}
        type="text"
        danger
        icon={<DeleteOutlined />}
      />
    </div>
  );
};
