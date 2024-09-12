import React, { useState } from "react";
import { Button, Space, Avatar } from "antd";
import {

  MoreOutlined,
} from "@ant-design/icons";
import InvoicePrint from "../../../components/InvoicePrint/invoicePrint";
import "./invoiceItemMob.css";
import { Sheet } from "react-modal-sheet";
import { useConfirmModal } from "../../../components/ConfirmModal/store";


const InvoiceItemMob = ({ item, onEdit, onDelete }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isActions, setIsActions] = useState(false);
  const { openConfirm, closeConfirm, setConfirmLoading } = useConfirmModal();


  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
    closeConfirm();
    setConfirmLoading(false);
  }

  return (
    <>
      <div className="invoice-item-mob">
        <div className="item-name">
          <Avatar
            style={{
              background:
                item.patient?.gender === "male" ? "#7265e6" : "#e91e63",
            }}
          >
            {item.patient?.name.substr(0, 1).toUpperCase()}
          </Avatar>
          <div className="name-info">
            <Space direction="vertical" size={4}>
              <span className="text-[16px]">{item.patient?.name}</span>
            </Space>
          </div>
        </div>
        <div className="item-amount">
          <span className="price">
            {item.amount}
            <span className="text-[10px]  mt-1 ml-1 text-gray-600">IQD</span>
          </span>
        </div>
        <Button
          type="text"
          icon={<MoreOutlined size={22} />}
          onClick={() => setIsActions(true)}
        />
        <Sheet
          isOpen={isActions}
          onClose={() => setIsActions(false)}
          detent="content-height"
        >
          <Sheet.Container className=" overflow-hidden">
            {/* <Sheet.Header /> */}
            <Sheet.Content>
              <div className="flex flex-col overflow-hidden">
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Delete Patient!",
                      msg: "Are you sure to delete this Patient?",
                      onConfirm: () => handleDelete(),
                    })
                  }
                  className="p-[20px] border border-b-[#eee] transition-all active:opacity-30 text-[#ff0000] text-[18px]"
                >
                  Delete Patient
                </button>

                <button
                  onClick={() => {
                    setIsActions(false);
                    onEdit(item);
                  }}
                  className="p-[20px]  border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
                >
                  Edit Invoice
                </button>

                <button
                  onClick={handlePrint}
                  className="p-[20px]  border-b border-b-[#eee] transition-all active:opacity-30 text-[18px]"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setIsActions(false)}
                  className="p-[20px] m-[20px] rounded-[12px] bg-[#f6f6f6] transition-all active:opacity-30 text-[18px]"
                >
                  Cancel
                </button>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onClick={() => setIsActions(false)} />
        </Sheet>
        <InvoicePrint
          invoice={item}
          isOpen={isPrintModalOpen}
          onClose={handleClosePrintModal}
        />
      </div>
    </>
  );
};

export default InvoiceItemMob;
