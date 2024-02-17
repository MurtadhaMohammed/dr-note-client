import React from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./fileItem.css";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import qc from "../../../lib/queryClient";
import { apiCall } from "../../../lib/services";

export const FileItem = ({ file }) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: `file/v1/delete/${file?.id}`, method: "DELETE", data }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      qc.invalidateQueries(`patient-${file?.patientId}`);
    },
    onError: () => message.error("Error !"),
  });

  return (
    <div
      className="file-item"
      //onClick={handleOpenFile}
    >
      <div className="file-info">
        <span className={`fiv-viv fiv-icon-png`}></span>
        <div className="file-text">
          <span>{file.name}</span>
          <small>
            {dayjs(file.createdAt).format("YYYY , dddd MM  hh:mm A")}
          </small>
        </div>
      </div>
      <Popconfirm
        title="Delete this file"
        description="Are you sure to delete this file?"
        onConfirm={() => mutate()}
        okText="Yes"
        cancelText="No"
      >
        <Button
          loading={isLoading}
          style={{ marginRight: -4 }}
          type="text"
          danger
          icon={<DeleteOutlined />}
        />
      </Popconfirm>
    </div>
  );
};
