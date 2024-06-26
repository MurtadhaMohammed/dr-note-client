import React, { useState, useEffect } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import { Select, Button, Modal } from "antd";
import "./Invoice.css";
import { useMobileDetect } from "../../hooks/mobileDetect";
import InvoiceForm from "./InvoiceForm/InvoiceForm"; 
import InvoiceList from "./InvoiceList/InvoiceList";
import { apiCall } from "../../lib/services";

const { Option } = Select;

const InvoiceScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const { isMobile } = useMobileDetect();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await apiCall({ url: `patient/v1/all` });
      setPatients(res);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleInvoiceSave = () => {
    handleModalClose();
    // Optionally handle save logic if needed
  };

  const handlePatientChange = (value) => {
    setSelectedPatient(value);
  };

  return (
    <div className="p-0 sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div>
            <span>Patient List for</span>
            <Select defaultValue="1" variant={false} onChange={handlePatientChange}>
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name}
                </Option>
              ))}
            </Select>
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
      <section className="patients-list mt-0 sm:mt-[12px]">
        <InvoiceList patientId={selectedPatient} />
        {isMobile && (
          <button className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg">
            <UserAddOutlined className="text-[22px]" />
          </button>
        )}
      </section>

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
