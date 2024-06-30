import React, { useState, useMemo } from "react";
import { List, Modal, message, Spin, Empty } from "antd";
import InvoiceForm from "../InvoiceForm/InvoiceForm";
import InvoiceItem from "../InvoiceItem/InvoiceItem";
import InvoiceItemMob from "../invoiceItemMob/InvoiceItemMob";
import SearchBox from "../../../components/SearchBox/searchBox";
import { useAppStore } from "../../../lib/store";
import { apiCall } from "../../../lib/services";
import { useMobileDetect } from "../../../hooks/mobileDetect";
import { useInfiniteQuery } from "react-query";
import "./InvoiceList.css";

const InvoiceList = ({ patientId }) => {
  const { isMobile } = useMobileDetect();
  const pageSize = 10;
  const { querySearch } = useAppStore();

  const {
    data,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    ["invoices", patientId],
    async ({ pageParam = 0 }) => {
      const res = await apiCall({
        url: `invoice/v1/all?take=${pageSize}&skip=${pageParam}`,
      });
      return { data: res, nextCursor: pageParam + pageSize };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page.data),
        hasNext: data.pages.findIndex((el) => el.data.length === 0) === -1,
      }),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleSave = async () => {
    refetch();
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
      refetch();
    } catch (error) {
      message.error("Failed to delete invoice.");
    }
  };

  const InvoiceCard = isMobile ? InvoiceItemMob : InvoiceItem;

  // Filter the invoices based on the search query
  const filteredData = useMemo(() => {
    if (!querySearch?.value) {
      return data?.pages || [];
    }
    return (data?.pages || []).filter((invoice) =>
      invoice.patient.name.toLowerCase().includes(querySearch.value.toLowerCase())
    );
  }, [data, querySearch]);

  return (
    <div className="lists">
      <section className="invoices-list">
        <Spin tip="Loading..." spinning={isLoading}>
          {filteredData.length > 0 ? (
            filteredData.map((item, k) => (
              <InvoiceCard
                key={k}
                item={item}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          ) : (
            <Empty style={{ padding: 50 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
      </section>
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
