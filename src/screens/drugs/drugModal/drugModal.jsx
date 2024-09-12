import React, { useState } from "react";
import { Modal, Input, Row, Col, message, Button } from "antd";
import { useMutation } from "react-query";
import { apiCall } from "../../../lib/services";
import qc from "../../../lib/queryClient";

const InputField = ({ label, input }) => (
  <div className="text-input">
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

export const DrugForm = ({ visible, onClose }) => {
  const [name, setName] = useState("");

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "drug/v1/create", method: "POST", data }),
    onSuccess: () => {
      message.success("Drug added successfully.");
      setName("");
      qc.invalidateQueries("drugs");
      onClose();
    },
    onError: () => message.error("Error adding drug!"),
  });

  const handleSave = () => {
    if (!name) {
      message.error("Please enter a drug name.");
      return;
    }
    mutate({ name });
  };

  return (
    <Modal
      title="Add Drug"
      open={visible}
      destroyOnClose
      width={400}
      footer={
        <Button
          style={{ marginTop: 16 }}
          block
          loading={isLoading}
          type="primary"
          disabled={!name}
          onClick={handleSave}
        >
          Save
        </Button>
      }
      onCancel={onClose}
    >
      <div>
        <Row gutter={[25, 25]}>
          <Col span={24}>
            <InputField
              label="Drug Name"
              input={
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="large"
                  placeholder="Amoxicillin"
                />
              }
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
