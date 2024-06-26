import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Space, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { FaMapMarkerAlt, FaCopy } from "react-icons/fa";
import Avatar from "antd/lib/avatar/avatar";
import getAge from "get-age";
import "./patientItemMob.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import qc from "../../../lib/queryClient";
import { apiCall } from "../../../lib/services";
import { Sheet } from "react-modal-sheet";
import { useConfirmModal } from "../../../components/ConfirmModal/store";

export const PatientItemMob = ({ item, onEdit, onHistory }) => {
  let navigate = useNavigate();
  const [isActions, setIsActions] = useState(false);
  const { openConfirm, closeConfirm, setConfirmLoading } = useConfirmModal();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: `patient/v1/delete/${item?.id}`, method: "DELETE", data }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      qc.invalidateQueries("patients");
      setIsActions(false);
      closeConfirm();
    },
    onError: () => message.error("Error !"),
  });

  useEffect(() => {
    setConfirmLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <div className="patient-item-mob">
        <div className="item-name">
          <Avatar
            style={{
              background: item.gender === "male" ? "#7265e6" : "#e91e63",
            }}
          >
            {item.name.substr(0, 1).toUpperCase()}
          </Avatar>
          <div className="name-info">
            <Space direction="vertical" size={4}>
              <span className="text-[16px]">{item.name}</span>
              {item.phone && (
                <small className="text-[#666]">{item.phone}</small>
              )}
              {/* <small>{item.address || "..."}</small> */}
            </Space>
          </div>
        </div>
        {/* <div className="item-age">
        {getAge(item.birthDate) || 0}
        <span>Years Old</span>
      </div> */}
        <div className="item-address">
          <FaMapMarkerAlt style={{ fontSize: 22, color: "#ccc" }} />
          <div className="address-info">
            <span>{item.address || "..."}</span>
            <small>Address</small>
          </div>
        </div>
        <div className="item-new">
          <Space>
            {/* 
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/patients/${item.id}`)}
        >
          + Chekup
        </Button> */}
            <Button
              type="text"
              icon={<MoreOutlined size={22} />}
              onClick={() => setIsActions(true)}
            />
          </Space>
        </div>

        {/* <div className="item-actions">
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
      </div> */}
      </div>
      <Sheet
        isOpen={isActions}
        onClose={() => setIsActions(false)}
        detent="content-height"
      >
        <Sheet.Container className=" overflow-hidden">
          {/* <Sheet.Header /> */}
          <Sheet.Content>
            <div className="flex flex-col overflow-hidden">
              <button
                onClick={() =>
                  openConfirm({
                    title: "Delete Patient!",
                    msg: "Are you sure to delete this Patient?",
                    onConfirm: () => mutate(),
                  })
                }
                className="p-[20px] border border-b-[#eee] transition-all active:opacity-30 text-[#ff0000] text-[18px]"
              >
                Delete Patient
              </button>
              <button
                className="p-[20px] border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
                onClick={() => {
                  setIsActions(false);
                  onHistory(item);
                }}
              >
                View History
              </button>
              <button
                onClick={() => {
                  setIsActions(false);
                  onEdit(item);
                }}
                className="p-[20px]  border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
              >
                Edit Patient
              </button>

              <button
                onClick={() => navigate(`/patients/${item.id}`)}
                className="p-[20px]  border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
              >
                Add New Checkup
              </button>
              <button
                onClick={() => setIsActions(false)}
                className="p-[20px] m-[20px] rounded-[12px] bg-[#f6f6f6] transition-all active:opacity-30 text-[18px]"
              >
                Cancel
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setIsActions(false)} />
      </Sheet>
    </>
  );
};
