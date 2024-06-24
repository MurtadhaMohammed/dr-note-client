import React from "react";
import { Button, Popconfirm, Space, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { FaMapMarkerAlt, FaCopy } from "react-icons/fa";
import Avatar from "antd/lib/avatar/avatar";
import getAge from "get-age";
import "./patientItem.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import qc from "../../../lib/queryClient";
import { apiCall } from "../../../lib/services";

export const PatientItem = ({ item, onEdit, onHistory }) => {
  let navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: `patient/v1/delete/${item?.id}`, method: "DELETE", data }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      qc.invalidateQueries("patients");
    },
    onError: () => message.error("Error !"),
  });

  return (
    <div className="patient-item">
      <div className="item-name">
        <Avatar
          style={{ background: item.gender === "male" ? "#7265e6" : "#e91e63" }}
        >
          {item.name.substr(0, 1).toUpperCase()}
        </Avatar>
        <div className="name-info">
          <Space direction="vertical" size={4}>
            <span>{item.name}</span>
            {item.phone && <small>{item.phone}</small>}
          </Space>
        </div>
      </div>
      <div className="item-age">
        {getAge(item.birthDate) || 0}
        <span>Years Old</span>
      </div>
      <div className="item-address">
        <FaMapMarkerAlt style={{ fontSize: 24, color: "#ccc" }} />
        <div className="address-info">
          <span>{item.address || "..."}</span>
          <small>Address</small>
        </div>
      </div>
      <div className="item-new">
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/patients/${item.id}`)}
        >
          + New Chekup
        </Button>
      </div>

      <div className="item-actions">
        <Button
          onClick={() => onHistory(item)}
          type="text"
          icon={<HistoryOutlined />}
        />
        <Button
          onClick={() => onEdit(item)}
          type="text"
          icon={<EditOutlined />}
        />
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => mutate()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            loading={isLoading}
            type="text"
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </div>
    </div>
  );
};
