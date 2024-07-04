import { Drawer } from "antd";
import {
  FaUserInjured,
  FaClipboardList,
  FaFlask,
  FaInfoCircle,
  FaFileInvoice,
  FaDollarSign
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export const MenuMob = ({ open, onClose, page }) => {
  let navigate = useNavigate();

  const activeStyle = (val) => {
    let style = {};
    if (page === val)
      style = {
        background: "#f6f6f6",
        color: "#0000ff",
      };
    return style;
  };

  return (
    <Drawer
      styles={{
        body: { margin: "6px !important" },
        header: { display: "none" },
      }}
      open={open}
      onClose={onClose}
      title={false}
      width={300}
    >
      <div className="w-[100%] bg-[#f6f6f6] h-[180px] rounded-[8px] flex items-center justify-center">
        <img src={logo} />
      </div>
      <ul>
        <li
          className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-8"
          onClick={() => {
            navigate("/");
            onClose();
          }}
          style={activeStyle("/")}
        >
          <FaUserInjured />
          <span>Patients</span>
        </li>
        <li
          className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
          onClick={() => {
            navigate("/schedule");
            onClose();
          }}
          style={activeStyle("/schedule")}
        >
          <MdDateRange />
          <span>Schedule</span>
        </li>
        <li
          className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
          onClick={() => {
            navigate("/attachements");
            onClose();
          }}
          style={activeStyle("/attachements")}
        >
          <FaClipboardList />
          <span>Attachments</span>
        </li>
        <li
          className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
          onClick={() => {
            navigate("/drugs");
            onClose();
          }}
          style={activeStyle("/drugs")}
        >
          <FaFlask />
          <span>Drugs list</span>
        </li>
        <li
          className={
            "flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
          }
          onClick={() => {
            navigate("/expenses");
            onClose();
          }}        >
          <FaDollarSign />
          <span>Expesnses</span>
        </li>
        <li
          className={
            "flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
          }
          onClick={() => {
            navigate("/Invoice");
            onClose();
          }}        >
          <FaFileInvoice />
          <span>Invoices</span>
        </li>
        <li className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3">
          <FaInfoCircle />
          <span>Info</span>
        </li>
      </ul>
      <div className=" bottom-10 left-0 right-0 flex justify-center">
        <small className="text-[#666]">
          Developed by{" "}
          <a
            href="https://www.puretik.com"
            target="_blank"
            className="text-[#0000ff]"
          >
            PureTik
          </a>
        </small>
      </div>
    </Drawer>
  );
};
