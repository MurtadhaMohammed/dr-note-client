import {
  Button,
  Col,
  DatePicker,
  Divider,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import CustomStep from "../../../components/customStep/customStep";
import "./scheduleForm.css";
import {
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { apiCall } from "../../../lib/services";
import dayjs from "dayjs";
import qc from "../../../lib/queryClient";

const InputFiled = (label, input) => (
  <div className="text-input">
    <p style={{ marginBottom: 6 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

const ScheduleForm = ({ onClose, onSave, currentDate }) => {
  const [current, setCurrent] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [patient, setPatient] = useState({});
  const [date, setDate] = useState(null);
  const [note, setNote] = useState("");
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["patient-book", searchValue],
    queryFn: () => apiCall({ url: `patient/v1/all?q=${searchValue}` }),
    refetchInterval: false,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "booking/v1/create", method: "POST", data }),
    onSuccess: () => {
      message.success(`Insert Successfully.`);
      qc.invalidateQueries("bookings");
      onSave();
    },
    onError: () => message.error("Error !"),
  });

  const onSelect = (id) => {
    let p = data?.find((p) => p.id === id);
    p.birthDate = dayjs(p?.birthDate);
    setPatient(p);
  };

  const handleChangeInput = (e) => {
    let { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSave = () => {
    mutate({ patient, date, note });
  };

  useEffect(() => {
    if (currentDate) setDate(currentDate);
    else setDate(null);
  }, [currentDate]);

  const steps = [
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Select
          allowClear
          style={{ width: "100%" }}
          placeholder={"Find patient or create"}
          showSearch={true}
          onSearch={setSearchValue}
          onClear={() => setSearchValue("")}
          onChange={onSelect}
          filterOption={false}
          notFoundContent={
            isFetching ? (
              <Spin size="small" />
            ) : (
              <Typography.Text type="secondary">No Results !</Typography.Text>
            )
          }
          options={(data || []).map((d) => ({
            value: d.id,
            label: d.name,
          }))}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider
                key={10000}
                style={{
                  margin: "8px 0",
                }}
              />

              <Button
                key={20000}
                onClick={(e) => {
                  e.preventDefault();
                  setIsNew(true);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }}
                type="text"
                block
                icon={<PlusOutlined />}
                style={{ textAlign: "start" }}
              >
                New Patient
              </Button>
            </>
          )}
        />
      </Col>
      {isNew || patient?.id ? (
        <>
          <Col span={24}>
            {InputFiled(
              "Patient Name",
              <Input
                value={patient?.name}
                name="name"
                onChange={handleChangeInput}
                ref={inputRef}
                placeholder="Murtadha M. Abed"
                suffix={<UserOutlined />}
              />
            )}
          </Col>
          <Col span={14}>
            {InputFiled(
              "Date of Birth",
              <DatePicker
                value={patient?.birthDate}
                onChange={(val) =>
                  setPatient({ ...patient, birthDate: dayjs(val) })
                }
                style={{ width: "100%" }}
                placeholder="Example 1998/6/30"
                //suffix={<ScheduleOutlined />}
              />
            )}
          </Col>
          <Col span={10}>
            {InputFiled(
              "Gender",
              <Select
                value={patient?.gender}
                onChange={(val) => setPatient({ ...patient, gender: val })}
                style={{ width: "100%" }}
                placeholder="Select Gender."
              >
                <Select.Option id={"male"} value={"male"}>
                  Male
                </Select.Option>
                <Select.Option id={"femal"} value={"femal"}>
                  Fmale
                </Select.Option>
              </Select>
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Phone Number",
              <Input
                value={patient?.phone}
                name={"phone"}
                onChange={handleChangeInput}
                placeholder="+0947723667432"
                suffix={<PhoneOutlined />}
              />
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Address",
              <Input
                value={patient?.address}
                name={"address"}
                onChange={handleChangeInput}
                placeholder="Baghdad - Al Shaab"
                suffix={<FaMapMarkerAlt />}
              />
            )}
          </Col>
          <Col span={1}>
            <Button
              size="small"
              danger
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => setPatient({})}
            >
              clear
            </Button>
          </Col>
        </>
      ) : (
        <div></div>
      )}
    </Row>,
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {InputFiled(
          "Booking Date",
          <DatePicker
            value={date}
            onChange={setDate}
            style={{ width: "100%" }}
            placeholder="Example 2024/6/30"
            //suffix={<ScheduleOutlined />}
          />
        )}
      </Col>
      <Col span={24}>
        {InputFiled(
          "Note",
          <Input.TextArea
            value={note}
            cols={2}
            onChange={(e) => setNote(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Write your note . . ."
            //suffix={<ScheduleOutlined />}
          />
        )}
      </Col>
    </Row>,
  ];

  const stepActions = [
    <Space>
      <Button type="danger" onClick={() => onClose(false)}>Cancel</Button>
      <Button
      type="primary"
        disabled={!patient || !patient?.name}
        onClick={() => setCurrent(1)}
      >
        Next
      </Button>
    </Space>,
    <Space>
      <Button onClick={() => setCurrent(0)}>Previus</Button>
      <Button
        loading={isLoading}
        disabled={!date}
        type="primary"
        onClick={handleSave}
      >
        Save
      </Button>
    </Space>,
  ];

  return (
    <div className="schedule-form">
      <div className="head">
        <Space direction="vertical" size={0}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            New Book
          </Typography.Title>
          <Typography.Text type="secondary">
            Choose patient and pick the date.
          </Typography.Text>
        </Space>
      </div>
      <div className="body">{steps[current]}</div>
      <Divider />
      <div className="app-flex mt-[60px]">
        <CustomStep size={2} current={current} />
        {stepActions[current]}
      </div>
    </div>
  );
};

export default ScheduleForm;
