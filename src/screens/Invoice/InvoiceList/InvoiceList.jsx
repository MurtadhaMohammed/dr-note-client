import React, { useEffect, useState } from "react";
import { List, Modal, message } from "antd";
import InvoiceForm from "../InvoiceForm/InvoiceForm";
import InvoiceItem from "../InvoiceItem/InvoiceItem";
import { apiCall } from "../../../lib/services";

const InvoiceList = ({patientId}) => {
  const [invoices, setInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await apiCall({ url: `patient/v1/all` });
      setPatients(res);
      
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await apiCall({ url: `invoice/v1/all` });
      setInvoices(res);
    } catch (error) {
      message.error(`Failed to fetch invoices.`);
    }
  };

  const handleSave = async (invoiceData) => {
    try {
      if (selectedInvoice) {
        await apiCall({
          url: `invoice/v1/edit/${selectedInvoice.id}`,
          method: "PUT",
          data: { ...invoiceData },
        });
        message.success("Invoice updated successfully.");
      } else {
        await apiCall({
          url: `invoice/v1/create`,
          method: "POST",
          data: { ...invoiceData },
        });
        message.success("Invoice created successfully.");
      }
      fetchInvoices();
      setIsModalVisible(false);
      setSelectedInvoice(null);
    } catch (error) {
      message.error("Failed to save invoice.");
    }
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
  };

  const handleDelete = async (invoiceId) => {
    try {
      await apiCall({
        url: `invoice/v1/delete/${invoiceId}`,
        method: "DELETE",
      });
      message.success("Invoice deleted successfully.");
      fetchInvoices();
    } catch (error) {
      message.error("Failed to delete invoice.");
    }
  };

  return (
    <div>
      <List
        dataSource={invoices}
        renderItem={(item) => (
          <InvoiceItem
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedInvoice(null);
        }}
        footer={null}
        width={400}
        destroyOnClose
      >
        <InvoiceForm
          onClose={() => {
            setIsModalVisible(false);
            setSelectedInvoice(null);
          }}
          onSave={handleSave}
          currentDate={new Date()}
          selectedInvoice={selectedInvoice}
        />
      </Modal>
    </div>
  );
};

export default InvoiceList;
