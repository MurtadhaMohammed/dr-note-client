import React, { useEffect } from "react";
import { Layout, Avatar } from "antd";
import {
  UserOutlined,
  UserSwitchOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import {
  FaUserInjured,
  FaClipboardList,
  FaFlask,
  FaInfoCircle,
} from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export const AppContainer = (props) => {
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    //console.log(location.pathname.split("/")[1]);
  }, [location]);
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={280}>
        <div className="brand">
          <img src={require("../assets/logo.svg")} />
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
            onClick={() => history.push("/")}
          >
            <FaUserInjured />
            <span>Patients</span>
          </li>
          <li
            className={location.pathname === "/attachements" ? "active" : ""}
            onClick={() => history.push("/attachements")}
          >
            <FaClipboardList />
            <span>Attachments</span>
          </li>
          <li
            className={location.pathname === "/drugs" ? "active" : ""}
            onClick={() => history.push("/drugs")}
          >
            <FaFlask />
            <span>Drugs list</span>
          </li>
          <li>
            <FaInfoCircle />
            <span>Info</span>
          </li>
        </ul>
        <small className="app-info">
          Developed by <a>PureTik</a>
        </small>
      </Sider>
      <Layout>
        <Header>
          <div className="container app-flex" style={{ height: "100%" }}>
            {props.head}
            <div className="user-account">
              <h4>Admin</h4>
              <Avatar>
                <UserOutlined />
              </Avatar>
            </div>
          </div>
        </Header>
        <Content>
          <div className="container">{props.children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};
