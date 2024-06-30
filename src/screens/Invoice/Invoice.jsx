import React, { useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Select, Button, Modal, Drawer } from "antd";
import "./Invoice.css";
import { useMobileDetect } from "../../hooks/mobileDetect";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import InvoiceList from "./InvoiceList/InvoiceList";

const { Option } = Select;

const InvoiceScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const { isMobile } = useMobileDetect();

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedPatient(null);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleInvoiceSave = () => {
    handleModalClose();
    handleDrawerClose();
  };

  const handlePatientChange = (value) => {
    setSelectedPatient(value);
  };

  return (
    <div className="page p-0 sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div>
            {/* <span>Patient List for</span>
            <Select
              defaultValue={patients[0]?.id}
              variant={false}
              onChange={handlePatientChange}
            >
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Option>
              ))}
            </Select> */}
          </div>
          <Button
            size="large"
            type="link"
            onClick={() => setIsModalVisible(true)}
          >
            + Add Invoice
          </Button>
        </section>
      )}
      <section className="mt-0 sm:mt-[12px]">
        <InvoiceList patientId={selectedPatient} />
        {isMobile && (
          <button
            className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-[#2c24ff] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
            onClick={() => setIsDrawerVisible(true)}
          >
            <UserAddOutlined className="text-[22px]" />
          </button>
        )}
      </section>

      <Drawer
        title="Add Invoice"
        placement="right"
        closable={true}
        width={440}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        onSave={handleInvoiceSave}
        onCancel={handleDrawerClose}
      >
        <InvoiceForm
          onClose={handleModalClose}
          onSave={handleInvoiceSave}
          currentDate={new Date()}
        />
      </Drawer>
      <Modal
        destroyOnClose
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={400}
        closable={false}
      >
        <InvoiceForm
          onClose={handleModalClose}
          onSave={handleInvoiceSave}
          currentDate={new Date()}
          selectedPatient={selectedPatient}
        />
      </Modal>
    </div>
  );
};

export default InvoiceScreen;
