import React, { useState } from "react";
import { List, Modal, message, Spin, Empty } from "antd";
import InvoiceForm from "../InvoiceForm/InvoiceForm";
import InvoiceItem from "../InvoiceItem/InvoiceItem";
import InvoiceItemMob from "../invoiceItemMob/InvoiceItemMob"; 
import { apiCall } from "../../../lib/services";
import { useMobileDetect } from "../../../hooks/mobileDetect"; 
// import LoadMoreBtn from "../../components/loadMoreBtn/loadMoreBtn"; 
import { useInfiniteQuery } from "react-query"; 
import "./InvoiceList.css";

const InvoiceList = ({ patientId }) => {
  const { isMobile } = useMobileDetect(); 
  const pageSize = 10; 

  const {
    data,
    isLoading,
    refetch, 
  } = useInfiniteQuery(
    ["invoices", patientId],
    async ({ pageParam = 0 }) => {
      const res = await apiCall({ url: `invoice/v1/all?take=${pageSize}&skip=${pageParam}` });
      return { data: res, nextCursor: pageParam + pageSize };
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => ({
        ...data,
        pages: data.pages.flatMap((page) => page.data),
        hasNext: data.pages.findIndex((el) => el.data.length === 0) === -1 ? true : false,
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

  return (
    <div className="lists">
      <section className="invoices-list">
        <Spin tip="Loading..." spinning={isLoading}>
          {data?.pages?.length > 0 ? (
            data.pages.map((item, k) => (
              <InvoiceCard
                key={k}
                item={item}
                onEdit={handleEdit}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          ) : (
            <Empty
              style={{ padding: 50 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>
      </section>
      {/* {data?.pages?.length >= pageSize && (
        <LoadMoreBtn
          loading={isFetchingNextPage}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          isMore={data?.hasNext}
          listLength={data?.pages?.length || 0}
        />
      )} */}
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
