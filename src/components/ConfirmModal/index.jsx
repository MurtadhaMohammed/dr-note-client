import "./style.css";
import { useConfirmModal } from "./store";

import { Button, Col, Row } from "antd";

const ConfirmModal = () => {
  const {
    visible,
    title,
    msg,
    onClose,
    onConfirm,
    confirmText,
    cancelText,
    closeConfirm,
    confirmLoading,
  } = useConfirmModal();

  return (
    <div className={`confirm-modal`}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClose(false);
          closeConfirm();
        }}
        className={"confirm-backdroup"}
        style={{ display: visible ? "flex" : "none" }}
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        id="confirm-sheet-content"
        className={`content ${visible ? "confirm-open-modal" : ""}`}
        style={{
          top: "auto",
          height: "auto",
        }}
      >
        <section className="p-[20px]">
          <b className="text-[18px]">{title}</b>
          <p className="text-[16px] opacity-60 mt-2">{msg}</p>

          <div className="mt-[40px]">
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  disabled={confirmLoading}
                  onClick={onConfirm}
                  block={true}
                  loading={confirmLoading}
                  className="h-[48px] rounded-[12px] text-[18px] text-[#ff0000] bg-[#f6f6f6] border-0"
                >
                {confirmText}
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  disabled={confirmLoading}
                  onClick={(_) => {
                    onClose(false);
                    closeConfirm();
                  }}
                  block={true} className="h-[48px] rounded-[12px] text-[18px] bg-[#f6f6f6] border-0"
                >
                  {cancelText}
                </Button>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConfirmModal;
