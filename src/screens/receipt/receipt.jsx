import React, { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Select, Button, Empty, Spin, List, Modal } from "antd";
import "./receipt.css";
import { useAppStore } from "../../lib/store";
import { useMobileDetect } from "../../hooks/mobileDetect";
import ReceiptForm from "./receiptForm/receiptForm";  // Ensure the path to ReceiptForm is correct
import ReceiptList from "./receiptList/receiptList"; // Ensure the path to ReceiptList is correct

const { Option } = Select;

const ReceiptScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { querySearch } = useAppStore();
  const { isMobile } = useMobileDetect();

  const handleAddReceipt = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleReceiptSave = () => {
    handleModalClose();
  };

  return (
    <div className="p-0 sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div>
            <span>Patient List for</span>
            <Select defaultValue="1" variant={false}>
              <Option value={"1"}>This Day</Option>
              <Option value={"2"}>Last Week</Option>
              <Option value={"3"}>All</Option>
            </Select>
          </div>
          <Button
            size="large"
            type="link"
            onClick={() => setIsModalVisible(true)}
          >
            + Add Receipt
          </Button>
        </section>
      )}
      <section className="patients-list mt-0 sm:mt-[12px]">
        <ReceiptList /> {/* Integrating the ReceiptList component */}
        {isMobile && (
          <button
            className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
          >
            <UserAddOutlined className="text-[22px]" />
          </button>
        )}
      </section>

      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={400}
        closable={false}
        destroyOnClose
      >
        <ReceiptForm
          onClose={handleModalClose}
          onSave={handleReceiptSave}
          currentDate={new Date()}
          selectedPatient={selectedPatient}
        />
      </Modal>
    </div>
  );
};

export default ReceiptScreen;
