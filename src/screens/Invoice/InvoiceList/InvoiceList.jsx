import React, { useEffect, useState } from "react";
import { List, Modal, message } from "antd";
import InvoiceForm from "../InvoiceForm/InvoiceForm";
import InvoiceItem from "../InvoiceItem/InvoiceItem";
import { apiCall } from "../../../lib/services";

const InvoiceList = ({ patientId }) => {
  const [invoices, setInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [patientId]);

  const fetchInvoices = async () => {
    try {
      const res = await apiCall({ url: `invoice/v1/all` });
      setInvoices(res);
    } catch (error) {
      message.error("Failed to fetch invoices.");
    }
  };

  const handleSave = async () => {
    fetchInvoices();
    setIsModalVisible(false);
    setSelectedInvoice(null);
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
          selectedInvoice={selectedInvoice}
        />
      </Modal>
    </div>
  );
};

export default InvoiceList;
