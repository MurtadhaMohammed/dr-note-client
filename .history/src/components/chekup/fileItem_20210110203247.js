import React from "react";
import { Button } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt, FaCopy } from "react-icons/fa";
import Avatar from "antd/lib/avatar/avatar";
const { shell } = require('electron')

export const FileItem = ({ item }) => {

  const distDir = './attach/'; // attachements folder path

  const handleOpenFile = () =>{
    shell.openPath(distDir+item.name);
  }

  return (
    <div className="file-item" onClick={}>
      <div className="file-info">
        <span className={`fiv-viv fiv-icon-${item.name.split('.').pop().toLowerCase()}`}></span>
        <div className="file-text">
          <span>{item.name.split('.').slice(0, -1).join('.')
          }</span>
          <small>{item.createdAt}</small>
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
