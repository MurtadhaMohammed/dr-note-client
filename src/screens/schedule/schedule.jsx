import React, { useEffect, useState } from "react";
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
import { UnorderedListOutlined, CalendarOutlined } from "@ant-design/icons";
import "./schedule.css";
import ScheduleForm from "./scheduleForm/scheduleForm";
import { useQuery } from "react-query";
import { apiCall } from "../../lib/services";
import { useAppStore } from "../../lib/store";
import dayjs from "dayjs";
import { PatientItem } from "./patientItem/patientItem";
import { PatientItemMob } from "./patientItemMob/patientItemMob";
import { useMobileDetect } from "../../hooks/mobileDetect";
import { IoCalendarOutline } from "react-icons/io5";
import { TbCalendarPlus } from "react-icons/tb";

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

  const getDateInBookings = () => {
    let dates = [];
    data?.map((b) => {
      if (!dates?.find((d) => dayjs(d).isSame(dayjs(b?.date), "date"))) {
        dates.push(b?.date);
      }
    });

    return dates;
  };

  useEffect(() => {
    if (isMobile) setTab("list");
  }, [isMobile]);

  const PatientCard = isMobile ? PatientItemMob : PatientItem;

  return (
    <div className="page schedule p-0 sm:p-[24px]">
      <div className="actions hidden sm:block">
        <Space>
          <Button size="md" type="primary" onClick={() => setIsNew(true)}>
            + New Book
          </Button>
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
        </Space>
      </div>

      {tab === "list" ? (
        <section className="mt-0 sm:mt-[8px] mb-[60px]">
          <Spin tip="Loading..." spinning={isLoading}>
            {getDateInBookings()?.length > 0 ? (
              getDateInBookings()?.map((date) => (
                <>
                  <div className="flex items-baseline justify-between w-full mt-[8px]">
                    <Space
                      size={4}
                      align="center"
                      className="mt-[24px] mb-3 ml-[16px] sm:ml-1"
                    >
                      <IoCalendarOutline />
                      <Divider type="vertical" />
                      <a className="text-[14px] text-[#666] block">
                        {dayjs(date)?.format("YYYY, ddd MM")}
                      </a>
                    </Space>
                    <a
                      onClick={() => {
                        setCurrentDate(dayjs(date));
                        setIsNew(true);
                      }}
                      className="block mr-[16px]"
                    >
                      + Add Book
                    </a>
                  </div>
                  <div className="patients-list">
                    {data
                      ?.filter((item) => dayjs(item?.date).isSame(date))
                      ?.map((item, k) => (
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
                      ))}
                  </div>
                </>
              ))
            ) : (
              <Empty
                style={{ padding: 50 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Spin>
          <button
            onClick={() => setIsNew(true)}
            className="fixed sm:hidden w-[54px] h-[54px] flex items-center justify-center bottom-4 right-4 bg-[#2c24ff] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
          >
            <TbCalendarPlus className="text-[22px]" />
          </button>
        </section>
      ) : (
        <section className="hidden sm:block -mt-[42px]">
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
              if (tab !== "list") setIsView(true);
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
