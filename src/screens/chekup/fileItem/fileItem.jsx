import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./fileItem.css";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import qc from "../../../lib/queryClient";
import { apiCall, URL } from "../../../lib/services";
import ImageViewer from "../../../components/ImageViewer/ImageViewer";

export const FileItem = ({ file }) => {
  const [flag, setFlag] = useState(false);

  console.log(file);

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
    <div className="file-item">
      <div
        className="file-info"
        onClick={(e) => {
          e.stopPropagation();
          const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(
            file?.name
          );
          if (isImage) {
            setFlag(true);
          } else {
            window.open(`${URL}/file/v1/image/${file?.name}`, "_blank");
          }
        }}
      >
        <span className={`fiv-viv fiv-icon-png`}></span>
        <div className="file-text">
          <span className="truncate w-[60vw]  md:w-[15vw]">{file.name}</span>
          <small>
            {dayjs(file.createdAt).format("YYYY , dddd MM  hh:mm A")}
          </small>
        </div>
      </div>

      <ImageViewer flag={flag} setFlag={setFlag} url={file?.name} />

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
