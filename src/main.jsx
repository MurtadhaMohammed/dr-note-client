import React, { useEffect, useState } from "react";
import { AppContainer } from "./components/appContainer";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "antd";
import HomeScreen from "./screens/home/home";
import ChekupScreen from "./screens/chekup/chekup";
import DrugsScreen from "./screens/drugs/drugs";
import AttachmentsScreen from "./screens/attachments/attachments";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAppStore } from "./lib/store";
import LoginScreen from "./screens/login/login";
import SearchBox from "./components/SearchBox/searchBox";
import ScheduleScreen from "./screens/schedule/schedule";
import ConfirmModal from "./components/ConfirmModal";
import "./index.css";
import InvoiceScreen from "./screens/Invoice/Invoice";
import ExpensesScreen from "./screens/expenses/expenses";

const GoBackComponent = () => {
  const { selectedName } = useAppStore();
  return (
    <div style={{ display: "inline-block" }}>
      <Button
        onClick={() => history.back()}
        type="text"
        icon={<FaArrowLeft />}
      />
      <span
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginLeft: 20,
          marginTop: -5,
        }}
      >
        {selectedName}
      </span>
    </div>
  );
};

function App() {
  const { isLogin } = useAppStore();
  const location = useLocation();
  let page = location.pathname.split("/")[1];

  console.log(page, 'page');

  return (
    <AppContainer
      head={
        page === "patients" ? (
          <GoBackComponent />
        ) : (
          <SearchBox page={page || "HOME"} />
        )
      }
      isContainer={isLogin}
    >
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/patients/:id"
          element={<ProtectedRoute comp={<ChekupScreen />} />}
        />
        <Route
          path="/patients/:id/visit/:visitId"
          element={<ProtectedRoute comp={<ChekupScreen />} />}
        />
        <Route
          path="/schedule"
          element={<ProtectedRoute comp={<ScheduleScreen />} />}
        />
        <Route
          path="/drugs"
          element={<ProtectedRoute comp={<DrugsScreen />} />}
        />
        <Route
          path="/attachements"
          element={<ProtectedRoute comp={<AttachmentsScreen />} />}
        />
        <Route
          path="/Invoice"
          element={<ProtectedRoute comp={<InvoiceScreen />} />}
        />
        <Route
          path="/expenses"
          element={<ProtectedRoute comp={<ExpensesScreen />} />}
        />
        <Route path="/" element={<ProtectedRoute comp={<HomeScreen />} />} />
      </Routes>
      <ConfirmModal />
    </AppContainer>
  );
}

const ProtectedRoute = ({ comp }) => {
  const { isLogin, setIsLogin } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("drNote_token");
    if (token) setIsLogin(true);
    else setIsLogin(false);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading . . .</div>;

  return isLogin ? comp : <Navigate to={"/login"} />;
};

export default App;
