import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Row,
  Col,
  Input,
  message,
  Space,
  AutoComplete,
} from "antd";
import { PlusOutlined, SaveOutlined, PrinterOutlined } from "@ant-design/icons";
import { DrugItem } from "./drugItem/drugItem";
import { FileItem } from "./fileItem/fileItem";
import DropZon from "../../components/dropZon/dropZon";
import { v4 as uuidv4 } from "uuid";
import "./chekup.css";
import { useMutation, useQuery } from "react-query";
import qc from "../../lib/queryClient";
import { apiCall } from "../../lib/services";
import { useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../../lib/store";

const { TextArea } = Input;

const InputFiled = (label, input) => (
  <div className="text-input" style={{ width: "100%" }}>
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

const ChekupScreen = () => {
  const [note, setNote] = useState(null);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [drugName, setDrugName] = useState(null);
  const [drugNote, setDrugNote] = useState(null);
  const [options, setOptions] = useState([]);
  const { id, visitId } = useParams();
  const { setSelectedName, setRacheta } = useAppStore();
  const navigate = useNavigate();

  const { mutate, isSaveLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "visit/v1/create", method: "POST", data }),
    onSuccess: (resp) => {
      message.success(`Insert Successfully.`);
      qc.invalidateQueries("patients");
      navigate(`/patients/${id}/visit/${resp?.id}`, { replace: true });
    },
    onError: () => message.error("Error !"),
  });

  const { data } = useQuery({
    queryKey: [`patient-${id}`, id],
    queryFn: (e) => apiCall({ url: `patient/v1/find/${e.queryKey[1]}` }),
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const { data: visit } = useQuery({
    queryKey: [`visit-${visitId}`, visitId],
    queryFn: (e) => apiCall({ url: `visit/v1/find/${e.queryKey[1]}` }),
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!visitId,
  });

  useEffect(() => {
    if (data) setSelectedName(data?.name);
  }, [data]);

  useEffect(() => {
    if (visit) {
      setNote(visit?.note);
      setSelectedDrugs(visit?.drugs);
    }
  }, [visit]);

  const { mutate: mutateFile, isLoading: isLoadingFile } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "file/v1/create", method: "POST", data, isFile: true }),
    onSuccess: () => {
      message.success(`Uplaod Successfully.`);
      qc.invalidateQueries(`patient-${id}`);
    },
    onError: () => message.error("Error !"),
  });

  const handleDrugAdd = async () => {
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

    await apiCall({
      url: "drug/v1/upsert",
      method: "PATCH",
      data: { name: drugName },
    });
  };

  const handlRemoveDrug = (id) => {
    setSelectedDrugs(selectedDrugs.filter((el) => el.id !== id));
  };

  const handleSave = () => {
    let _data = { note, drugs: selectedDrugs, patientId: id };
    if (visitId) _data.id = visitId;
    mutate(_data);
  };

  const getDrugs = async (search = "") => {
    let resp = await apiCall({ url: `drug/v1/all?q=${search}&take=10` });
    setOptions(
      resp.map((e) => {
        return {
          value: e.name,
        };
      })
    );
  };

  useEffect(() => {
    getDrugs();
  }, []);

  return (
    <div className="page checkup-screen" style={{ paddingTop: 25 }}>
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
              {InputFiled(
                "Prescription",
                <Space>
                  <AutoComplete
                    style={{
                      width: 300,
                    }}
                    size="large"
                    options={options}
                    value={drugName}
                    onChange={(val) => setDrugName(val)}
                    placeholder="Chose Drug . . ."
                    onSearch={getDrugs}
                  />
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
              <Space>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={isSaveLoading}
                  disabled={!note}
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  // type="primary"
                  size="large"
                  icon={<PrinterOutlined />}
                  disabled={!visitId}
                  onClick={() =>
                    setRacheta({
                      open: true,
                      data: {
                        patient: data,
                        visit,
                      },
                    })
                  }
                >
                  Print Racheta
                </Button>
              </Space>
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
          {data?.files?.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ChekupScreen;
