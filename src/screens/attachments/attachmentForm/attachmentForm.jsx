import { Button, Col, Row, Select, Spin, Typography, message } from "antd";
import DropZon from "../../../components/dropZon/dropZon";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { apiCall } from "../../../lib/services";
import qc from "../../../lib/queryClient";

const AttachmentForm = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [patientId, setPatientId] = useState(null);

  const { mutate: mutateFile, isLoading: isLoadingFile } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "file/v1/create", method: "POST", data, isFile: true }),
    onSuccess: () => {
      message.success(`Uplaod Successfully.`);
      qc.invalidateQueries("files");
      onClose();
    },
    onError: () => message.error("Error !"),
  });

  const { data, isFetching } = useQuery({
    queryKey: ["patient-file", searchValue],
    queryFn: () => apiCall({ url: `patient/v1/all?q=${searchValue}` }),
    refetchInterval: false,
  });

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Select
          showSearch={true}
          onSearch={setSearchValue}
          placeholder="Select patient"
          allowClear
          onClear={() => setSearchValue("")}
          value={patientId}
          onChange={setPatientId}
          filterOption={false}
          style={{ width: "100%" }}
          notFoundContent={isFetching ? <Spin size="small" /> : null}
          options={(data || []).map((d) => ({
            value: d.id,
            label: d.name,
          }))}
        ></Select>
      </Col>
      <Col span={24}>
        <DropZon loading={isLoadingFile} onChange={setFile} />
        {file && (
          <div style={{ marginTop: 8 }}>
            <Typography.Text>{file?.name}</Typography.Text>
          </div>
        )}
      </Col>
      <Col span={24}>
        <Button
          disabled={!patientId || !file}
          loading={isLoadingFile}
          type="primary"
          size="large"
          block
          onClick={() =>
            mutateFile({
              file,
              patientId,
            })
          }
        >
          Upload & Save
        </Button>
      </Col>
    </Row>
  );
};

export default AttachmentForm;
