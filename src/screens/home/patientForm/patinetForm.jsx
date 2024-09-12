import React, { useEffect } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  message,
  Form,
  Radio,
} from "antd";
import { SaveOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import "./patientForm.css";
import { useMutation } from "react-query";
import { apiCall } from "../../../lib/services";
import qc from "../../../lib/queryClient";
import dayjs from "dayjs";

const InputFiled = (label, input) => (
  <div className="text-input">
    <p style={{ marginBottom: 6 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

export const PatientForm = ({ record, onClose }) => {
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      record
        ? apiCall({ url: `patient/v1/edit/${record?.id}`, method: "PUT", data })
        : apiCall({ url: "patient/v1/create", method: "POST", data }),
    onSuccess: () => {
      message.success(`${record ? "Edit" : "Insert"} Successfully.`);
      qc.invalidateQueries("patients");
      form.resetFields();
      onClose(false);
    },
    onError: () => message.error("Error !"),
  });

  const insert = (data) => {
    let { name, birthDate, address, phone, gender } = data;
    mutate({
      name,
      birthDate,
      address,
      phone,
      gender,
    });
  };

  const update = (data) => {
    let { name, birthDate, address, phone, gender } = data;
    mutate({
      name,
      birthDate,
      address,
      phone,
      gender,
    });
  };

  const onFinish = (data) => {
    if (record) update(data);
    else insert(data);
  };

  useEffect(() => {
    if (record) {
      if (record?.birthDate) record.birthDate = dayjs(record?.birthDate);
      form.setFieldsValue({ ...record });
    } else form.resetFields();
  }, [record]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      style={{
        maxWidth: 600,
        height: "100%",
        marginBottom: "30px",
      }}
    >
      <div className="patient-form">
        <Row gutter={[25, 0]}>
          <Col span={24}>
            {InputFiled(
              "Patient Name",
              <Form.Item
                style={{ width: "100%" }}
                name="name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input
                  // value={name}
                  // onChange={(e) => setName(e.target.value)}
                  size="large"
                  placeholder="Murtadha M. Abed"
                  suffix={<UserOutlined />}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Date of Birth",
              <Form.Item name="birthDate" style={{ width: "100%" }}>
                <DatePicker
                  // value={birthDate}
                  // onChange={(val) => setBirthDate(val)}
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="Example 1998/6/30"
                //suffix={<ScheduleOutlined />}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Gender",
              <Form.Item
                className="gender"
                name="gender"
                style={{ width: "100%" }}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="Select Gender."
                >
                  <Select.Option id={"male"} value={"male"}>
                    Male
                  </Select.Option>
                  <Select.Option id={"femal"} value={"femal"}>
                    Female
                  </Select.Option>
                </Select>
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Phone Number",
              <Form.Item name="phone" style={{ width: "100%" }}>
                <Input
                  size="large"
                  placeholder="+0947723667432"
                  suffix={<PhoneOutlined />}
                />
              </Form.Item>
            )}
          </Col>
          <Col span={24}>
            {InputFiled(
              "Address",
              <Form.Item name="address" style={{ width: "100%" }}>
                <Input
                  // value={address}
                  // onChange={(e) => setAddress(e.target.value)}
                  size="large"
                  placeholder="Baghdad - Al Shaab"
                  suffix={<FaMapMarkerAlt />}
                />
              </Form.Item>
            )}
          </Col>
        </Row>
        <Button
          style={{ width: 140, marginBottom: 30 }}
          className="add-btn"
          size="large"
          icon={<SaveOutlined />}
          htmlType="submit"
          // disabled={name && birthDate && gender ? false : true}
          //onClick={handleSubmit}
          loading={isLoading}
        >
          Save Data
        </Button>
      </div>
    </Form>
  );
};
