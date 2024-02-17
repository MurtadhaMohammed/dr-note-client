import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Row,
  Col,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { DrugItem } from "./drugItem/drugItem";
import { FileItem } from "./fileItem/fileItem";
import DropZon from "../../components/dropZon/dropZon";
import { v4 as uuidv4 } from "uuid";
import "./chekup.css";
import { useMutation, useQuery } from "react-query";
import qc from "../../lib/queryClient";
import { apiCall } from "../../lib/services";
import { useParams } from "react-router-dom";
import { useAppStore } from "../../lib/store";

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
    createdAt: "Nov 20, 2020",
    type: "pdf",
  },
  {
    id: 3,
    title: "Test DH results doers Bar Noo This Test Only",
    name: "Ali Salam",
    createdAt: "Nov 20, 2020",
    type: "xls",
  },
  {
    id: 89,
    title: "Test DH results doers",
    name: "Marwa Salam",
    createdAt: "Nov 20, 2020",
    type: "pdf",
  },
];

const ChekupScreen = (props) => {
  const [note, setNote] = useState(null);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [drugName, setDrugName] = useState(null);
  const [drugNote, setDrugNote] = useState(null);
  const { id, name } = useParams();
  const { setSelectedName } = useAppStore();

  const { mutate, isSaveLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "visit/v1/create", method: "POST", data }),
    onSuccess: () => {
      message.success(`Insert Successfully.`);
      qc.invalidateQueries("patients");
    },
    onError: () => message.error("Error !"),
  });

  const { data } = useQuery({
    queryKey: [`patient-${id}`, id],
    queryFn: (e) => apiCall({ url: `patient/v1/find/${e.queryKey[1]}` }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (data) setSelectedName(data?.name);
  }, [data]);

  const { mutate: mutateFile, isLoading: isLoadingFile } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "file/v1/create", method: "POST", data, isFile: true }),
    onSuccess: () => {
      message.success(`Uplaod Successfully.`);
      qc.invalidateQueries(`patient-${id}`);
    },
    onError: () => message.error("Error !"),
  });

  const handleDrugAdd = () => {
    setSelectedDrugs([
      ...selectedDrugs,
      {
        id: uuidv4(),
        name: drugName,
        note: drugNote,
      },
    ]);

    setDrugName(null);
    setDrugNote(null);
  };

  const handlRemoveDrug = (id) => {
    setSelectedDrugs(selectedDrugs.filter((el) => el.id !== id));
  };

  const handleSave = () => {
    let _data = { note, drugs: selectedDrugs, patientId: id };
    mutate(_data);
  };

  return (
    <div className="page" style={{ paddingTop: 25 }}>
      <Row gutter={[50, 50]}>
        <Col span={16}>
          <Row gutter={[20, 40]}>
            <Col span={24}>
              {InputFiled(
                "The diagnosis",
                <TextArea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: "100%" }}
                  rows={6}
                  placeholder="Write The diagnosis hire . . ."
                />
              )}
            </Col>

            <Col span={24} style={{ display: "flex", alignItems: "flex-end" }}>
              {/* <Typography.Text>Prescription</Typography.Text>
              <br/> */}
              {InputFiled(
                "Prescription",
                <Space>
                  <Select
                    size="large"
                    showSearch
                    allowClear
                    value={drugName}
                    style={{ width: 300 }}
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
                  <Input
                    value={drugNote}
                    onChange={(e) => setDrugNote(e.target.value)}
                    size="large"
                    placeholder="Note"
                  />
                  <Button
                    size="large"
                    disabled={!drugName}
                    onClick={handleDrugAdd}
                    icon={<PlusOutlined />}
                  />
                </Space>
              )}
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
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                loading={isSaveLoading}
                disabled={!note}
                onClick={handleSave}
              >
                Save & Print
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <h4>Attachments</h4>
          <DropZon
            loading={isLoadingFile}
            onChange={(file) =>
              mutateFile({
                file,
                patientId: id,
              })
            }
          />
          {data?.files.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ChekupScreen;
