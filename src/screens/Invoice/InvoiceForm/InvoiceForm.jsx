import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
  Spin,
} from "antd";
import {
  PlusOutlined,
  DollarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { apiCall } from "../../../lib/services";
import dayjs from "dayjs";
import qc from "../../../lib/queryClient";
import CustomStep from "../../../components/customStep/customStep";
import "./InvoiceForm.css";

const InputField = (label, input) => (
  <div className="text-input">
    <p style={{ marginBottom: 6 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

const InvoiceForm = ({ onClose, onSave, selectedInvoice, patientId }) => {
  const [current, setCurrent] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [patient, setPatient] = useState(selectedInvoice?.patient || {});
  const [date, setDate] = useState(
    selectedInvoice
      ? dayjs(selectedInvoice.date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD")
  );
  const [amount, setAmount] = useState(selectedInvoice?.amount || "");
  const [service, setService] = useState(selectedInvoice?.service || "");
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["patient-book", searchValue],
    queryFn: () => apiCall({ url: `patient/v1/all?q=${searchValue}` }),
    refetchInterval: false,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({
        url: selectedInvoice
          ? `invoice/v1/edit/${selectedInvoice.id}`
          : "invoice/v1/create",
        method: selectedInvoice ? "PUT" : "POST",
        data,
      }),
    onSuccess: () => {
      message.success(
        `Invoice ${selectedInvoice ? "Updated" : "Added"} Successfully.`
      );
      qc.invalidateQueries("invoices");
      onSave();
    },
    onError: () => message.error("Error!"),
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
    mutate({
      patientId: patient.id || patientId,
      date,
      service,
      amount,
    });
    onClose();
  };

  useEffect(() => {
    if (selectedInvoice) {
      setPatient(selectedInvoice.patient);
      setDate(dayjs(selectedInvoice.date).format("YYYY-MM-DD"));
      setAmount(selectedInvoice.amount);
      setService(selectedInvoice.service);
    } else {
      setPatient({});
      setDate(dayjs().format("YYYY-MM-DD"));
      setAmount("");
      setService("");
    }
  }, [selectedInvoice]);

  const steps = [
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Select
          disabled={!!patient?.id}
          className="gender"
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
              <Typography.Text type="secondary">No Results!</Typography.Text>
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
      <>
        <Col span={24}>
          {InputField(
            "Patient Name",
            <Input
              value={patient?.name}
              name="name"
              onChange={handleChangeInput}
              ref={inputRef}
              placeholder="John Doe"
            />
          )}
        </Col>
        <Col span={24}>
          {InputField(
            "Phone Number",
            <Input
              value={patient?.phone}
              name={"phone"}
              onChange={handleChangeInput}
              placeholder="+123456789"
            />
          )}
        </Col>
        <Col span={24}>
          {InputField(
            "Address",
            <Input
              value={patient?.address}
              name={"address"}
              onChange={handleChangeInput}
              placeholder="123 Main St"
            />
          )}
        </Col>
        <Col span={24}>
          <Button
            size="small"
            danger
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => setPatient({})}
          >
            Clear
          </Button>
        </Col>
      </>
    </Row>,
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {InputField(
          "Service",
          <Select
            value={service}
            onChange={(value) => setService(value)}
            placeholder="Select or enter service"
            style={{ width: "100%" }}
            className="gender"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <div
                  style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                >
                  <Input
                    style={{ flex: "auto" }}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="Enter custom service"
                  />
                </div>
              </>
            )}
          >
            <Select.Option key="1" value="Service 1">
              Service 1
            </Select.Option>
            <Select.Option key="2" value="Service 2">
              Service 2
            </Select.Option>
          </Select>
        )}
      </Col>
      <Col span={24}>
        {InputField(
          "Amount",
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            prefix={<DollarOutlined />}
          />
        )}
      </Col>
    </Row>,
  ];

  const stepActions = [
    <Space>
      <Button onClick={() => onClose(false)}>Cancel</Button>
      <Button
        disabled={!patient || !patient?.name}
        onClick={() => setCurrent(1)}
      >
        Next
      </Button>
    </Space>,
    <Space>
      <Button onClick={() => setCurrent(0)}>Previous</Button>
      <Button
        loading={isLoading}
        disabled={!service || !amount}
        type="primary"
        onClick={handleSave}
      >
        Save
      </Button>
    </Space>,
  ];

  return (
    <div className="Invoice-form">
      <div className="head">
        <Space direction="vertical" size={0}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {selectedInvoice ? "Edit Invoice" : "New Invoice"}
          </Typography.Title>
          <Typography.Text type="secondary">
            Select patient and fill in Invoice details.
          </Typography.Text>
        </Space>
      </div>
      <div className="body">{steps[current]}</div>
      <Divider />
      <div className="app-flex">
        <CustomStep size={2} current={current} />
        {stepActions[current]}
      </div>
    </div>
  );
};

export default InvoiceForm;
