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
  Modal,
} from "antd";
import { FaFileInvoice } from "react-icons/fa";
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
import InvoiceForm from "../Invoice/InvoiceForm/InvoiceForm";

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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      message.success(`Upload Successfully.`);
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

  useEffect(() => {
    console.log('Selected Invoice (ChekupScreennnnnnnnn):', data);
  }, [data]);

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

  const handleSaveInvoice = async () => {
    refetch();
    setIsModalVisible(false);
  };

  return (
    <div className="page checkup-screen p-[16px] sm:p-[24px]">
      <div className="m-[10px] sm:m-0">
        <Row gutter={[50, 50]} className="m-0">
          <Col md={16}>
            <Row gutter={[20, 40]}>
              <Col span={24}>
                {InputFiled(
                  "The diagnosis",
                  <TextArea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: "100%" }}
                    rows={6}
                    placeholder="Write The diagnosis here . . ."
                  />
                )}
              </Col>

              <Col
                span={24}
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                {InputFiled(
                  "Prescription",
                  <Space>
                    <AutoComplete
                      className="w-[180px] sm:w-[300px] h-10"
                      size="large"
                      options={options}
                      value={drugName}
                      onChange={(val) => setDrugName(val)}
                      placeholder="Choose Drug . . ."
                      onSearch={getDrugs}
                    />
                    <Input
                      className="flex-1 h-10"
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
                  <Button
                    size="large"
                    icon={<FaFileInvoice />}
                    disabled={!visitId}
                    onClick={() => setIsModalVisible(true)}
                  >
                    Add Invoice
                  </Button>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col md={8} xs={24}>
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
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        footer={null}
        width={400}
        destroyOnClose
      >
        <InvoiceForm
          visit={visit}
          patientId={id}
          selectedInvoice={{ patient: data }}
          onClose={() => {
            setIsModalVisible(false);
          }}
          onSave={handleSaveInvoice}
        />
      </Modal>
    </div>
  );
};

export default ChekupScreen;
