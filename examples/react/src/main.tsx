import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/global.scss";
import { WebTracingProvider } from "@web-tracing/react";

const options = {
  dsn: "http://localhost:3354/trackweb",
  appName: "react-example",
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebTracingProvider options={options}>
      <App />
    </WebTracingProvider>
  </React.StrictMode>
);
