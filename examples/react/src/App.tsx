import { useState } from "react";
import { HashRouter, useRoutes, Navigate, Outlet } from "react-router-dom";
import MenuList from "./components/MenuList";
import { Button, Modal, message } from "antd";
import axios from "axios";
import { routes } from "./router";

// Layout component to match App.vue structure
const Layout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_baseInfo, setBaseInfo] = useState<any>({});

  // Transform routes to match MenuList expectation if needed
  // MenuList expects items prop.
  // Based on MenuList.tsx from previous context (not shown but assumed), it likely iterates over items.
  // The routes export from ./router has meta properties.
  const menuItems = routes.filter(
    (item) => item.path !== "/" && item.path !== "*"
  );

  const getBaseInfo = () => {
    return axios.get("/getBaseInfo").then((res) => {
      setBaseInfo(res.data.data);
      return res.data.data;
    });
  };

  const showBaseInfo = () => {
    getBaseInfo().then((info) => {
      if (info) {
        // Construct display info similar to Vue example
        const displayInfo = Object.keys(info).map((key) => (
          <div
            className="pop-line"
            key={key}
            style={{ display: "flex", alignItems: "center", marginBottom: 5 }}
          >
            <div style={{ width: 100, fontWeight: "bold" }}>{key}: </div>
            <span style={{ flex: 1, wordBreak: "break-all" }}>
              {JSON.stringify(info[key])}
            </span>
          </div>
        ));

        Modal.info({
          title: "核心基础信息",
          content: <div>{displayInfo}</div>,
          width: 600,
          okText: "确定",
        });
      }
    });
  };

  const cleanTracingList = () => {
    axios.post("/cleanTracingList").then(() => {
      message.success("清除成功");
      // @ts-ignore
      if (window.getAllTracingList) {
        // @ts-ignore
        window.getAllTracingList();
      }
    });
  };

  return (
    <div id="app" style={{ display: "flex", height: "100vh" }}>
      <div
        className="left-menu"
        style={{ width: 260, height: "100%", borderRight: "1px solid #eee" }}
      >
        <MenuList items={menuItems} />
      </div>
      <div
        className="right-body"
        style={{ flex: 1, height: "100%", overflowY: "auto", padding: 20 }}
      >
        <Outlet />
      </div>
      <Button
        className="clean-1"
        type="primary"
        onClick={showBaseInfo}
        style={{
          position: "fixed",
          bottom: 80,
          left: 20,
          width: 220,
          height: 40,
        }}
      >
        查看核心基础信息
      </Button>
      <Button
        className="clean-2"
        type="primary"
        danger
        onClick={cleanTracingList}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 220,
          height: 40,
        }}
      >
        清除所有事件信息
      </Button>
    </div>
  );
};

// Router component to handle route definitions
const AppRouter = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        ...routes.map((route) => {
          if (route.redirect) {
            return {
              path: route.path,
              element: <Navigate to={route.redirect} replace />,
            };
          }
          return {
            path: route.path,
            element: route.element,
          };
        }),
      ],
    },
  ]);
  return element;
};

function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  );
}

export default App;
