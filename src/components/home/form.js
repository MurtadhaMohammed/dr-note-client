import React from "react";
import { Button, Input, Row, Col, DatePicker, Select } from "antd";
import { SaveOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PatientStore } from "../../store/patinetStore";

const InputFiled = (label, input) => (
  <div className="text-input">
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

export const PatientForm = ({onSubmit, loading}) => {
  let {
    name,
    age,
    address,
    gender,
    phone,
    setName,
    setAge,
    setGender,
    setPhone,
    setAddress,
  } = PatientStore();
  return (
    <div className="patient-form">
      <Row gutter={[25, 25]}>
        <Col span={24}>
          {InputFiled(
            "Patient Name",
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
              placeholder="Murtadha M. Abed"
              suffix={<UserOutlined />}
            />
          )}
        </Col>
        <Col span={24}>
          {InputFiled(
            "Date of Birth",
            <DatePicker
              value={age}
              onChange={(val) => setAge(val)}
              style={{ width: "100%" }}
              size="large"
              placeholder="Example 1998/6/30"
              //suffix={<ScheduleOutlined />}
            />
          )}
        </Col>
        <Col span={24}>
          {InputFiled(
            "Gender",
            <Select
              value={gender}
              onChange={(val) => setGender(val)}
              style={{ width: "100%" }}
              size="large"
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="large"
              placeholder="+0947723667432"
              suffix={<PhoneOutlined />}
            />
          )}
        </Col>
        <Col span={24}>
          {InputFiled(
            "Address",
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              size="large"
              placeholder="Baghdad - Al Shaab"
              suffix={<FaMapMarkerAlt />}
            />
          )}
        </Col>
      </Row>
      <Button
        style={{ width: 140 }}
        className="add-btn"
        size="large"
        icon={<SaveOutlined />}
        disabled={name && age && gender ? false : true}
        onClick={onSubmit}
        loading={loading}
      >
        Save Data
      </Button>
    </div>
  );
};
