import "./App.css";
import {
  Navigate,
  useRoutes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Views/Login";
// import { handleRoutersData, handleRoutersData_netCore } from "./Menus";
// import Layout from "./Views/Shared/Layout";
import { useRef, useState } from "react";
import { useEffect } from "react";
// import { BACKENDVERSION } from "./Common/Const";
// import { setStorageItem, getStorageItem } from "./Common/StorageService";
import axios from "axios";
import { BASEURL } from "/src/Common/Const.js";

function App() {
  const menuData = useSelector((x) => x.menu);
  const [routers, setRouters] = useState([]);
  const navigate = useNavigate();
  const urlPathRef = useRef(useLocation().pathname);
  // const firstLogin = getStorageItem("key")?.First_Login;
  let allRoutes = [
    {
      path: "/Login",
      element: <Login />,
    },
    // {
    //   path: "/",
    //   element: <Layout />,
    //   children: [
    //     {
    //       index: true,
    //       element:
    //         routers.length === 0 || firstLogin === "True" ? (
    //           <></>
    //         ) : (
    //           <SYSNEWS020 />
    //         ),
    //     },
    //     {
    //       path: "/IFAA/IFAA340F",
    //       element: <IFAA340F />,
    //     },
    //   ].concat(
    //     routers.map((x) => {
    //       return x;
    //     }),
    //   ),
    // },
    {
      path: "*",
      element: <Navigate replace to={"/"}></Navigate>,
    },
  ];
  const [isInitializing, setIsInitializing] = useState(true);
  // 應用系統配置
  const applySystemConfig = (config) => {
    // 更新網頁標題
    document.title = config.title;

    // 更新 favicon
    const favicon = document.querySelector("link[rel*='icon']");
    favicon.href = BASEURL + `/Image/${config.file}/logo.ico`;
  };
  // 獲取系統配置
  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        // 先檢查 Storage 中是否已有系統配置
        const cachedConfig = "";
        // const cachedConfig = getStorageItem("systemConfig", true, null);

        if (cachedConfig) {
          // 使用已快取的配置
          // applySystemConfig(cachedConfig);
        } else {
          // 獲取新的系統配置
          // const response = await axios.get(
          //   BASEURL + "/api/Auth/GetCmpIdentify",
          // );
          // if (response.data) {
          //   // const config = response.data;
          //   // 應用系統配置
          //   // applySystemConfig(config[0]);
          //   // 儲存到 Storage
          //   // setStorageItem(
          //   //   "systemConfig",
          //   //   config[0],
          //   //   true, // 儲存為 JSON
          //   // );
          // }
        }
      } catch (error) {
        console.error("獲取系統配置失敗:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchSystemConfig();
  }, []);

  useEffect(() => {

    if (menuData.menu.length > 0) {
      setTimeout(() => {
        // if (firstLogin === "True") {
        //   navigate("/IFAA/IFAA340F");
        // } else {
        //   navigate(urlPathRef.current);
        // }
      }, 0);
    }
  }, [menuData]);

  const routes = useRoutes(allRoutes);
  // 如果仍在初始化，顯示加載指示器
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
      >加載中</div>
    );
  }

  return routes;
}

export default App;
