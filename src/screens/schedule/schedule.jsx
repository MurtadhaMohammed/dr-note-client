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
  Empty,
} from "antd";
import {
  UnorderedListOutlined,
  CalendarOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import "./schedule.css";
import ScheduleForm from "./scheduleForm/scheduleForm";
import { useQuery } from "react-query";
import { apiCall } from "../../lib/services";
import { useAppStore } from "../../lib/store";
import dayjs from "dayjs";
import { PatientItem } from "./patientItem/patientItem";
import { PatientItemMob } from "./patientItemMob/patientItemMob";
import { useMobileDetect } from "../../hooks/mobileDetect";

const { Option } = Select;

const ScheduleScreen = () => {
  const [isNew, setIsNew] = useState(false);
  const [isView, setIsView] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const { querySearch } = useAppStore();
  const { isMobile } = useMobileDetect();
  const [tab, setTab] = useState("schedule");

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

  const PatientCard = isMobile ? PatientItemMob : PatientItem;

  return (
    <div className="schedule p-[16px] sm:p-[24px]">
      <section className="app-flex head">
        <div></div>

        <div className="actions">
          <Space>
            <Radio.Group
              options={[
                {
                  label: <UnorderedListOutlined />,
                  value: "list",
                },
                {
                  label: <CalendarOutlined />,
                  value: "schedule",
                },
              ]}
              value={tab}
              optionType="button"
              onChange={(e) => setTab(e.target.value)}
            />

            <Button size="md" type="primary" onClick={() => setIsNew(true)}>
              + New Book
            </Button>
          </Space>
        </div>
      </section>
      {tab === "list" ? (
        <section className="patients-list mt-16">
          <Spin tip="Loading..." spinning={isLoading}>
            {data?.length > 0 ? (
              data?.map((item, k) => (
                <PatientCard
                  key={k}
                  item={item?.patient}
                  // onHistory={(val) => {
                  //   setRecord(val);
                  //   setIsHistory(true);
                  // }}
                  // onEdit={(val) => {
                  //   setRecord(val);
                  //   setIsModal(true);
                  // }}
                />
              ))
            ) : (
              <Empty
                style={{ padding: 50 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Spin>
          <button
            onClick={() => setIsModal(true)}
            class="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
          >
            <UserAddOutlined className="text-[22px]" />
          </button>
        </section>
      ) : (
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
                            b?.patient?.gender === "male"
                              ? "#7265e6"
                              : "#e91e63"
                          }
                        />{" "}
                        {b?.patient?.name}
                      </Typography.Text>
                    </li>
                  ))}
                {parseList(current).count !== 0 && (
                  <Typography.Text
                    style={{ fontSize: 14 }}
                    type="secondary"
                  >{`+${parseList(current).count} Patients`}</Typography.Text>
                )}
              </ul>
            )}
          />
        </section>
      )}

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
        <div className="-mx-[20px]">
          {currentDate &&
            parseList(currentDate)?.list?.map((b, i) => (
              <PatientItem bookingId={b?.id} item={b?.patient} />
            ))}
        </div>
      </Modal>
    </div>
  );
};
export default ScheduleScreen;
