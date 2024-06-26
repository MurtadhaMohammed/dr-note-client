import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/main";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import qc from "./src/lib/queryClient";
import "./src/css/app.css";
import "./src/css/custom.css";
import "./src/css/animation.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={qc}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#2c24ff",
              colorLink: "#2c24ff",
              borderRadius: 4,
            },
          }}
        >
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);
