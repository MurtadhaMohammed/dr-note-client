import React, { useState } from "react";
import {
  Select,
  Button,
  Calendar,
  Badge,
  Space,
  Radio,
  Modal,
  Spin,
  Typography,
  Divider,
} from "antd";
import { UnorderedListOutlined, CalendarOutlined } from "@ant-design/icons";
import "./schedule.css";
import ScheduleForm from "./scheduleForm/scheduleForm";
import { useQuery } from "react-query";
import { apiCall } from "../../lib/services";
import { useAppStore } from "../../lib/store";
import dayjs from "dayjs";
import { PatientItem } from "./patientItem/patientItem";

const { Option } = Select;

const ScheduleScreen = () => {
  const [isNew, setIsNew] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const { querySearch } = useAppStore();

  let searchValue = querySearch?.key === "schedule" ? querySearch?.value : "";

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", searchValue],
    queryFn: () => apiCall({ url: `booking/v1/all?q=${searchValue}` }),
    refetchInterval: false,
  });

  // const onPanelChange = (value, mode) => {
  //   console.log(value.format("YYYY-MM-DD"), mode);
  // };

  const parseList = (current) => {
    let list = data
      ? [...data]?.filter((b) => current?.isSame(dayjs(b?.date), "D"))
      : [];
    return {
      count: list?.length > 3 ? list?.length - 3 : 0,
      list,
    };
  };

  return (
    <div className="page schedule">
      <section className="app-flex head">
        <div></div>

        <div className="actions">
          <Space>
            <Radio.Group
              options={[
                {
                  label: <UnorderedListOutlined />,
                  value: "list",
                  disabled: true,
                },
                {
                  label: <CalendarOutlined />,
                  value: "schedule",
                },
              ]}
              // onChange={onChange4}
              value={"schedule"}
              optionType="button"
            />

            <Button size="md" type="primary" onClick={() => setIsNew(true)}>
              + New Book
            </Button>
          </Space>
        </div>
      </section>
      <section>
        <Calendar
          //onPanelChange={onPanelChange}
          onSelect={(current, { source }) => {
            if (source !== "date") return;
            setCurrentDate(current);
            setIsView(true);
          }}
          cellRender={(current, info) => (
            <ul className="events">
              {parseList(current)
                ?.list?.slice(0, 3)
                ?.map((b, i) => (
                  <li key={i}>
                    <Typography.Text ellipsis>
                      <Badge
                        color={
                          b?.patient?.gender === "male" ? "#7265e6" : "#e91e63"
                        }
                      />{" "}
                      {b?.patient?.name}
                    </Typography.Text>
                  </li>
                ))}
              {parseList(current).count !== 0 && (
                <Typography.Text style={{ fontSize: 14 }} type="secondary">{`+${
                  parseList(current).count
                } Patients`}</Typography.Text>
              )}
            </ul>
          )}
        />
      </section>
      <Modal
        destroyOnClose
        footer={null}
        closable={false}
        open={isNew}
        width={400}
        onCancel={() => {
          setCurrentDate(null);
          setIsNew(false);
        }}
      >
        <ScheduleForm
          onClose={() => {
            setIsNew(false);
            setCurrentDate(null);
          }}
          onSave={() => {
            if (currentDate) {
              setIsNew(false);
              setIsView(true);
            } else {
              setIsNew(false);
              setCurrentDate(null);
            }
          }}
          currentDate={currentDate}
        />
      </Modal>
      <Modal
        destroyOnClose
        footer={null}
        // closable={false}
        open={isView}
        width={800}
        title={
          <Typography.Title style={{ margin: 0 }} level={4}>
            {dayjs(currentDate).format("YYYY, dddd MM")}
          </Typography.Title>
        }
        onCancel={() => {
          setIsView(false);
          setCurrentDate(null);
        }}
        styles={{
          body: { height: "60vh", overflow: "auto" },
        }}
      >
        <div className="app-flex bookings-modal-title">
          <Typography.Text
            style={{ fontWeight: "normal" }}
            type="secondary"
          >{`You have ${
            parseList(currentDate)?.list?.length
          } bookings for this date`}</Typography.Text>

          <Button
            type="link"
            size="small"
            onClick={() => {
              setIsView(false);
              setIsNew(true);
            }}
          >
            + New Book
          </Button>
        </div>
        {currentDate &&
          parseList(currentDate)?.list?.map((b, i) => (
            <PatientItem bookingId={b?.id} item={b?.patient} />
          ))}
      </Modal>
    </div>
  );
};
export default ScheduleScreen;
