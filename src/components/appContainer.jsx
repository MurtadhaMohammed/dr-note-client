import React, { useEffect } from "react";
import { Layout, Avatar, Dropdown, Space } from "antd";
import logo from "../assets/logo.svg";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { MdDateRange } from "react-icons/md";

import {
  FaUserInjured,
  FaClipboardList,
  FaFlask,
  FaInfoCircle,
  FaFileInvoice,
} from "react-icons/fa";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/store";
import { RachetaModal } from "./racheta/racheta";
import { HeaderMob } from "./headerMob/headerMob";

const { Header, Sider, Content } = Layout;

const items = [
  {
    key: "logout",
    danger: true,
    label: "Logout",
  },
];

export const AppContainer = ({ head, children, isContainer }) => {
  // let history = useHistory();
  let { setIsLogin, user } = useAppStore();
  let navigate = useNavigate();

  useEffect(() => {
    //console.log(location.pathname.split("/")[1]);
  }, [location]);

  if (!isContainer) return <div className="container">{children}</div>;

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={220} theme="light" className="side-bar">
        <div className="brand">
          <img src={logo} />
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
            className={location.pathname === "/Invoice" ? "active" : ""} // New Invoice menu item
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
        <small className="app-info mt-1000">
          Developed by{" "}
          <a href="https://www.puretik.com" target="_blank">
            PureTik
          </a>
        </small>
      </Sider>
      <Layout>
        <HeaderMob />
        <Header className="hidden sm:block">
          <div className="container app-flex" style={{ height: "100%" }}>
            {head}
            <Dropdown
              menu={{
                items,
                onClick: ({ key }) => {
                  if (key === "logout") {
                    setIsLogin(false);
                    localStorage.removeItem("drNote_token");
                  }
                },
              }}
            >
              <div className="user-account">
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
        <Content>
          <div className="container">{children}</div>
        </Content>
      </Layout>
      <RachetaModal />
    </Layout>
  );
};
