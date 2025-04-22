import React from "react";
import { Button, Popconfirm, Space, message, Avatar } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import getAge from "get-age";
import "./patientItem.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import qc from "../../../lib/queryClient";
import { apiCall } from "../../../lib/services";
import { FiX } from "react-icons/fi";

export const PatientItem = ({ bookingId, item }) => {
  let navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      apiCall({
        url: `booking/v1/delete/${bookingId}`,
        method: "DELETE",
      }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      qc.invalidateQueries("bookings");
    },
    onError: () => message.error("Error !"),
  });

  return (
    <div className="patient-item-schedule">
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
        <Popconfirm
          title="Delete the task"
          description="Are you sure to cancel this booking?"
          onConfirm={() => {
            mutate();
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            loading={isLoading}
            size="small"
            className="mt-1"
            danger
            icon={<FiX className="-mb-0.5" />}
          />
        </Popconfirm>
      </div>
    </div>
  );
};
