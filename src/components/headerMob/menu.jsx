import { Drawer, Popconfirm } from "antd";
import {
  FaUserInjured,
  FaClipboardList,
  FaFlask,
  FaInfoCircle,
  FaFileInvoice,
  FaDollarSign,
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../lib/store";
import { LuLogOut } from "react-icons/lu";
import "./menu.css";

export const MenuMob = ({ open, onClose, page }) => {
  let navigate = useNavigate();
  let { setIsLogin } = useAppStore();

  const activeStyle = (val) => {
    let style = {};
    if (page === val)
      style = {
        background: "#f6f6f6",
        color: "#0000ff",
      };
    return style;
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("drNote_token");
    onClose();
  };

  return (
    <div>
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
            style={{ ...activeStyle("/"), cursor: "pointer" }}
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
            style={{ ...activeStyle("/schedule"), cursor: "pointer" }}
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
            style={{
              ...activeStyle("/attachements"),
              cursor: "pointer",
              pointerEvents: "none",
              opacity: 0.4,
            }}
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
            style={{ ...activeStyle("/drugs"), cursor: "pointer" }}
          >
            <FaFlask />
            <span>Drugs list</span>
          </li>
          <li
            className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
            onClick={() => {
              navigate("/expenses");
              onClose();
            }}
            style={{ ...activeStyle("/expenses"), cursor: "pointer" }}
          >
            <FaDollarSign />
            <span>Expenses</span>
          </li>
          <li
            className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3"
            onClick={() => {
              navigate("/Invoice");
              onClose();
            }}
            style={{
              ...activeStyle("/Invoice"),
              cursor: "pointer",
              pointerEvents: "none",
              opacity: 0.4,
            }}
          >
            <FaFileInvoice />
            <span>Invoices</span>
          </li>
          <li className="flex items-center gap-2 text-[18px] rounded-[8px] p-[12px] mt-3">
            <Popconfirm
              title="Are you sure to logout?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <span
                className="flex items-center gap-2"
                style={{ cursor: "pointer" }}
              >
                <LuLogOut size={22} color="red" />
                <span>Logout</span>
              </span>
            </Popconfirm>
          </li>
        </ul>
        <div className="pos bottom-10 left-0 right-0 flex justify-center">
          <small className="footer text-[#666]">
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
    </div>
  );
};
