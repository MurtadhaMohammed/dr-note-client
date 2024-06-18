import "./style.css";
import { Button } from "antd";
import { FiX } from "react-icons/fi";

const ConfirmHeader = ({ onClose, title }) => {
  return (
    <div className={"header"}>
      <div className="app-container app-flex-space">
        <b className="mb-[10px]">{title}</b>
        <Button onClick={() => onClose(false)} icon={<FiX />} />
      </div>
    </div>
  );
};

export default ConfirmHeader;
