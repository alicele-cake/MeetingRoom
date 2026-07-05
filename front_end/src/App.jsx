import "./App.css";
import {
  Navigate,
  useRoutes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import Login from "./Views/Login";
import Layout from "./Views/Shared/Layout";
import Home from "./Views/Home";
import { handleRoutersData, handleRoutersData_netCore } from "./Menus";
import { BACKENDVERSION } from "/src/Common/Const.js";

function App() {
  const menuData = useSelector((x) => x.menu);
  const [routers, setRouters] = useState([]);
  const navigate = useNavigate();
  const urlPathRef = useRef(useLocation().pathname);
  const [isInitializing, setIsInitializing] = useState(true);

  let allRoutes = [
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ].concat(
        routers.map((x) => {
          return x;
        })
      ),
    },
    {
      path: "*",
      element: <Navigate replace to={"/"}></Navigate>,
    },
  ];

  // 初始化（保留遮罩機制，之後可在此掛系統設定/載入邏輯）
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // 依選單資料動態產生路由
  useEffect(() => {
    BACKENDVERSION === "netCore"
      ? setRouters(handleRoutersData_netCore(menuData.menu))
      : setRouters(handleRoutersData(menuData.menu));

    if (menuData.menu.length > 0) {
      // 路由產生後導回原本要去的路徑
      setTimeout(() => {
        navigate(urlPathRef.current);
      }, 0);
    }
  }, [menuData]);

  const routes = useRoutes(allRoutes);

  // 初始化中顯示加載指示器
  if (isInitializing) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        加載中
      </div>
    );
  }

  return routes;
}

export default App;
