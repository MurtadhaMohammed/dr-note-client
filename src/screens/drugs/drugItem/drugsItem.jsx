import React from "react";
import { Button, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./drugItem.css";
import dayjs from "dayjs";
import { useMutation } from "react-query";
import { apiCall } from "../../../lib/services";
import qc from "../../../lib/queryClient";

export const DrugsItem = ({ item }) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: `drug/v1/delete/${item?.id}`, method: "DELETE", data }),
    onSuccess: () => {
      message.success("Delete Successfully.");
      qc.invalidateQueries("drugs");
    },
    onError: () => message.error("Error !"),
  });

  return (
    <div className="drugs-item">
      <div className="info">
        <span style={{ backgroundColor: item.color }}></span>
        <div>
          <h4 className="truncate w-[60vw]  md:w-[15vw] text-[18px] p-1">{item.name}</h4>
          <small style={{ color: "gray" }}>
            {dayjs(item.createdAt).format("YYYY , dddd MM  hh:mm A")}
          </small>
        </div>
      </div>
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
  );
};
