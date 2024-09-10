import React, { useState, useMemo, useEffect } from "react";
import {
  List,
  Modal,
  message,
  Spin,
  Empty,
  Select,
  Button,
  Drawer,
  Divider,
} from "antd";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import InvoiceItem from "./InvoiceItem/InvoiceItem";
import InvoiceItemMob from "./invoiceItemMob/InvoiceItemMob";
import { useAppStore } from "../../lib/store";
import { apiCall } from "../../lib/services";
import { useMobileDetect } from "../../hooks/mobileDetect";
import { useInfiniteQuery } from "react-query";
import { UserAddOutlined } from "@ant-design/icons";
import "./Invoice.css";

const { Option } = Select;

const InvoiceScreen = () => {
  const { isMobile } = useMobileDetect();
  const { querySearch } = useAppStore();
  const pageSize = 10;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dateRange, setDateRange] = useState("1");

  const { data, isLoading, refetch } = useInfiniteQuery(
    ["invoices", dateRange],
    async ({ pageParam = 0 }) => {
      const res = await apiCall({
        url: `invoice/v1/all?take=${pageSize}&skip=${pageParam}&range=${dateRange}`,
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

  useEffect(() => {
    refetch();
  }, [dateRange]);

  const handleSave = () => {
    refetch();
    setIsModalVisible(false);
    setIsDrawerVisible(false);
    setSelectedInvoice(null);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    if (isMobile) {
      setIsDrawerVisible(true);
    } else {
      setIsModalVisible(true);
    }
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

  const filteredData = useMemo(() => {
    if (!querySearch?.value) {
      return data?.pages || [];
    }
    return (data?.pages || []).filter((invoice) =>
      invoice.patient.name
        .toLowerCase()
        .includes(querySearch.value.toLowerCase())
    );
  }, [data, querySearch]);

  return (
    <div className="page p-0 sm:p-[24px]">
      {!isMobile && (
        <section className="app-flex">
          <div className="p flex align-center justify-center">
            <p className="mx-1">Invoice List</p>
            <Divider type="vertical" />
            <Select
              popupMatchSelectWidth={false}
              defaultValue="1"
              onChange={(value) => setDateRange(value)}
              variant="borderless"
            >
              <Option value="3">This Day</Option>
              <Option value="2">Last Week</Option>
              <Option value="1">All Time</Option>
            </Select>
          </div>
          <Button
            size="large"
            type="link"
            onClick={() => {
              setSelectedInvoice(null);
              setIsModalVisible(true);
            }}
          >
            + Add Invoice
          </Button>
        </section>
      )}

      <section className="mt-0 sm:mt-[12px]">
        <div className="lists">
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
              <Empty
                style={{ padding: 50 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Spin>
        </div>
        {isMobile && (
          <button
            className="fixed sm:hidden w-[54px] h-[54px] bottom-4 right-4 bg-[#2c24ff] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg"
            onClick={() => {
              setSelectedInvoice(null);
              setIsDrawerVisible(true);
            }}
          >
            <UserAddOutlined className="text-[22px]" />
          </button>
        )}
      </section>

      <Drawer
        title="Add/Edit Invoice"
        placement="right"
        closable={true}
        width={440}
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        <InvoiceForm
          onClose={() => setIsDrawerVisible(false)}
          onSave={handleSave}
          selectedInvoice={selectedInvoice}
        />
      </Drawer>
      <Modal
        destroyOnClose
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={400}
        closable={false}
      >
        <InvoiceForm
          onClose={() => setIsModalVisible(false)}
          onSave={handleSave}
          selectedInvoice={selectedInvoice}
        />
      </Modal>
    </div>
  );
};

export default InvoiceScreen;
