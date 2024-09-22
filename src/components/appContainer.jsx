import React, { useEffect, useRef } from "react";
import { Layout, Avatar, Dropdown, Space, Popconfirm } from "antd";
import logo from "../assets/logo.svg";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { MdDateRange } from "react-icons/md";
import {
  FaUserInjured,
  FaClipboardList,
  FaFlask,
  FaInfoCircle,
  FaFileInvoice,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/store";
import { RachetaModal } from "./racheta/racheta";
import { HeaderMob } from "./headerMob/headerMob";

const { Header, Sider, Content } = Layout;

export const AppContainer = ({ head, children, isContainer }) => {
  let { setIsLogin, user, setIsScroll, isScroll } = useAppStore();
  let navigate = useNavigate();
  const prevScrollTopRef = useRef(0);

  const handleScroll = (e) => {
    const currentScrollTop = e.target.scrollTop;
    const prevScrollTop = prevScrollTopRef.current;

    if (currentScrollTop > prevScrollTop) !isScroll && setIsScroll(true);
    else isScroll && setIsScroll(false);

    prevScrollTopRef.current = currentScrollTop;
  };

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem("drNote_token");
  };

  const menuItems = [
    {
      key: "logout",
      danger: true,
      label: (
        <Popconfirm
          title="Are you sure you want to logout?"
          onConfirm={handleLogout}
          okText="Yes"
          cancelText="No"
        >
          <span>Logout</span>
        </Popconfirm>
      ),
    },
  ];

  if (!isContainer) return <div className="container">{children}</div>;

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={220} theme="light" className="hidden lg:block">
        <div className="brand">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="side-menu">
          <li
            className={
              location.pathname === "/"
                ? "active"
                : location.pathname.split("/")[1] === "patients"
                ? "active"
                : ""
            }
            onClick={() => navigate("/")}
          >
            <FaUserInjured />
            <span>Patients</span>
          </li>
          <li
            className={
              location.pathname === "/schedule" 
                ? "active"
                : location.pathname.split("/")[1] === "schedule"
                ? "active"
                : ""
            }
            onClick={() => navigate("/schedule")}
          >
            <MdDateRange />
            <span>Schedule</span>
          </li>
          <li
            className={location.pathname === "/attachements" ? "active" : ""}
            onClick={() => navigate("/attachements")}
          >
            <FaClipboardList />
            <span>Attachments</span>
          </li>
          <li
            className={location.pathname === "/drugs" ? "active" : ""}
            onClick={() => navigate("/drugs")}
          >
            <FaFlask />
            <span>Drugs list</span>
          </li>
          <li
            className={location.pathname === "/expenses" ? "active" : ""}
            onClick={() => navigate("/expenses")}
          >
            <FaDollarSign />
            <span>Expenses</span>
          </li>
          <li
            className={location.pathname === "/Invoice" ? "active" : ""}
            onClick={() => navigate("/Invoice")}
          >
            <FaFileInvoice />
            <span>Invoices</span>
          </li>
          <li>
            <FaInfoCircle />
            <span>Info</span>
          </li>
        </ul>
        <small className="app-info mt-1500">
          Developed by{" "}
          <a href="https://www.puretik.com" target="_blank" rel="noopener noreferrer">
            PureTik
          </a>
        </small>
      </Sider>
      <Layout>
        <HeaderMob />
        <Header className="hidden lg:block">
          <div className="container app-flex" style={{ height: "100%" }}>
            {head}
            <Dropdown
              menu={{
                items: menuItems,
              }}
            >
              <div className="user-account" style={{ cursor: "pointer" }}>
                <Space size={0}>
                  <DownOutlined style={{ fontSize: 12 }} />
                  <h4>{user.name || user.phone}</h4>
                </Space>
                <Avatar>
                  <UserOutlined />
                </Avatar>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content onScroll={handleScroll}>
          <div className="container">{children}</div>
        </Content>
      </Layout>
      <RachetaModal />
    </Layout>
  );
};
