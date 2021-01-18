import React, { useState, useEffect } from "react";
import { Select, Button, Empty, Spin, Drawer, Row, Col, Input } from "antd";
import { PatientItem, PatientForm } from "../components/home";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { DrugItem, FileItem } from "../components/chekup";
import { DropZon } from "../components";
const fs = require('fs');

const { Option } = Select;
const { TextArea } = Input;

const InputFiled = (label, input) => (
  <div className="text-input" style={{ width: "100%" }}>
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

const selectedDrugs = [
  {
    id: 34,
    name: "New Test Drug name",
    note: "this is just test note",
  },
  {
    id: 56,
    name: "Drug name for test only",
    note: "this is a test",
  },
  {
    id: 43,
    name: "Foo Bar",
    note: "just test note",
  },
];

const files = [
  {
    id: 1,
    title: 'Test DH results doers Foo Yees',
    name: 'مرتضى محمد علاء',
    date: 'Nov 20, 2020',
    type: 'pdf'
  },
  {
    id: 3,
    title: 'Test DH results doers Bar Noo This Test Only',
    name: 'ِAli Salam',
    date: 'Nov 20, 2020',
    type: 'xls'
  },
  {
    id: 89,
    title: 'Test DH results doers',
    name: 'Marwa Salam',
    date: 'Nov 20, 2020',
    type: 'pdf'
  },
]

const uploadFile = (file)=> {

// console.log(file.name);
var sourceFile= file.path;
var distDir= "../../attach/";
console.log(sourceFile);
console.log(distDir);
  fs.copyFile(sourceFile, distDir+file.name)
  .then(() => console.log(file.name + ' was copied to attachments folder '+distDir))
  .catch(err => console.error(err))
  // fs.mov(sourceFile, distDir, (err) => {
  //   if (err) throw err;
  //   console.log(file.name + ' was copied to attachments folder '+distDir);
  // });
}

export const ChekupScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isNew, setIsNew] = useState(false);

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
                style={{ width: "100%" }}
                placeholder="Chose Drug . . ."
              >
                <Option>One</Option>
                <Option>Two</Option>
              </Select>
            </Col>

            <Col span={9} style={{ display: "flex", alignItems: "flex-end" }}>
              <Input size="large" placeholder="Note" />
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
                icon={<PlusOutlined />}
              />
            </Col>
            <Col span={24}>
              <div className="selected-drugs">
                {selectedDrugs.map((item) => (
                  <DrugItem key={item.id} item={item} />
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
          {/* <DropZon onChange={file => console.log(file.name)} /> */}
          <DropZon onChange={file => uploadFile(file)} />
          {
            files.map(item => <FileItem key={item.id} item={item} />)
          }

        </Col>
      </Row>
    </div>
  );
};
