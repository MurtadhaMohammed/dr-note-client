import React, { useState } from "react";
import { Modal, Input, Row, Col, message, Space, Button } from "antd";
import { useMutation } from "react-query";
import { apiCall } from "../../../lib/services";
import qc from "../../../lib/queryClient";

const InputFiled = (label, input) => (
  <div className="text-input">
    <p style={{ marginBottom: 8 }}>{label}</p>
    <div style={{ display: "flex" }}>{input}</div>
  </div>
);

export const DrugForm = ({ visible, onClose }) => {
  let [name, setName] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: (data) =>
      apiCall({ url: "drug/v1/create", method: "POST", data }),
    onSuccess: () => {
      message.success(`Insert Successfully.`);
      setName(null);
      qc.invalidateQueries("drugs");
      onClose(false);
    },
    onError: () => message.error("Error !"),
  });

  return (
    <div>
      <Modal
        title="Add Prescption"
        open={visible}
        destroyOnClose
        width={400}
        footer={
            <Button
              style={{marginTop: 16}}
              block
              loading={isLoading}
              type="primary"
              disabled={!name}
              onClick={() => mutate({ name })}
            >
              Save
            </Button>
         
        }
        onCancel={onClose}
      >
        <div>
          <Row gutter={[25, 25]}>
            <Col span={24}>
              {InputFiled(
                "Prescption Name",
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="large"
                  placeholder="amoxicillin"
                />
              )}
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};
