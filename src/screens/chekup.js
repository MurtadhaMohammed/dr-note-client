import React, { useState, useEffect } from "react";
import { Select, Button, Empty, Spin, Drawer, Row, Col, Input } from "antd";
import { PatientItem, PatientForm } from "../components/home";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { DrugItem, FileItem } from "../components/chekup";
import { DropZon } from "../components";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;
const { TextArea } = Input;

const InputFiled = (label, input) => (
  <div className="text-input" style={{ width: "100%" }}>
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

// const selectedDrugs = [
//   {
//     id: 34,
//     name: "New Test Drug name",
//     note: "this is just test note",
//   },
//   {
//     id:56,
//     name: "Drug name for test only",
//     note: "this is a test",
//   },
//   {
//     id: 43,
//     name: "Foo Bar",
//     note: "just test note",
//   },
// ];

const files = [
  {
    id: 1,
    title: "Test DH results doers Foo Yees",
    name: "مرتضى محمد علاء",
    date: "Nov 20, 2020",
    type: "pdf",
  },
  {
    id: 3,
    title: "Test DH results doers Bar Noo This Test Only",
    name: "Ali Salam",
    date: "Nov 20, 2020",
    type: "xls",
  },
  {
    id: 89,
    title: "Test DH results doers",
    name: "Marwa Salam",
    date: "Nov 20, 2020",
    type: "pdf",
  },
];

export const ChekupScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isNew, setIsNew] = useState(false);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [drugName, setDrugName] = useState("");
  const [drugNote, setDrugNote] = useState("");

  const handleDrugAdd = () => {
    setSelectedDrugs([
      ...selectedDrugs,
      {
        id: uuidv4(),
        name: drugName,
        note: drugNote,
      },
    ]);
  };

  const handlRemoveDrug = (id) => {
    setSelectedDrugs(selectedDrugs.filter((el) => el.id !== id));
  };

  useEffect(() => {
    setDrugName("");
    setDrugNote("");
    console.log(JSON.stringify(selectedDrugs));
  }, [selectedDrugs]);

  return (
    <div className="page" style={{ paddingTop: 25 }}>
      <Row gutter={[50, 50]}>
        <Col span={16}>
          <Row gutter={[20, 40]}>
            <Col span={24}>
              {InputFiled(
                "The diagnosis",
                <TextArea
                  style={{ width: "100%" }}
                  rows={6}
                  placeholder="Write The diagnosis hire . . ."
                />
              )}
            </Col>
            <Col span={24}></Col>
            <Col span={12}>
              {InputFiled("Prescription")}
              <Select
                size="large"
                showSearch
                allowClear
                value={drugName}
                style={{ width: "100%" }}
                placeholder="Chose Drug . . ."
                onChange={(val) => setDrugName(val)}
              >
                <Option key={1} value="drugOne">
                  One
                </Option>
                <Option key={2} value="drugTwo">
                  Two
                </Option>
              </Select>
            </Col>

            <Col span={9} style={{ display: "flex", alignItems: "flex-end" }}>
              <Input
                value={drugNote}
                onChange={(e) => setDrugNote(e.target.value)}
                size="large"
                placeholder="Note"
              />
            </Col>
            <Col
              span={3}
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <Button
                size="large"
                block
                className="add-btn"
                onClick={handleDrugAdd}
                icon={<PlusOutlined />}
              />
            </Col>
            <Col span={24}>
              <div className="selected-drugs">
                {selectedDrugs.map((item) => (
                  <DrugItem
                    key={item.id}
                    item={item}
                    onRemove={handlRemoveDrug}
                  />
                ))}
              </div>
            </Col>
            <Col span={24}>
              <Button
                type="link"
                className="add-btn"
                size="large"
                icon={<SaveOutlined />}
              >
                Save & Print
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <h4>Attachments</h4>
          <DropZon onChange={(file) => console.log(file)} />
          {files.map((item) => (
            <FileItem key={item.id} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
};
