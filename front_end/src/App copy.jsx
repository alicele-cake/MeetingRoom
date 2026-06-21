import "./App.css";
import {
  Navigate,
  useRoutes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Views/Login";
import EipLoginHandler from "./Views/EipLoginHandler";
import EipLoginError from "./Views/EipLoginError";
import SsoLoginHandler from "./Views/SsoLoginHandler";
import SsoLoginError from "./Views/SsoLoginError";
import { handleRoutersData, handleRoutersData_netCore } from "./Menus";
import Layout from "./Views/Shared/Layout";
import { useRef, useState } from "react";
import { useEffect } from "react";
import IFAA340F from "./Views/IFAA/IFAA340F";
import IFAC060F from "./Views/IFAC/IFAC060F";
import IFAC080F from "./Views/IFAC/IFAC080F";
import SYSNEWS020 from "./Views/SYS/SYSNEWS020";
import IFAD6010F from "./Views/IFAD/IFAD6010F";
import { BACKENDVERSION } from "./Common/Const";
import { setStorageItem, getStorageItem } from "./Common/StorageService";
import axios from "axios";
import { BASEURL } from "/src/Common/Const.js";

function App() {
  const menuData = useSelector((x) => x.menu);
  const [routers, setRouters] = useState([]);
  const navigate = useNavigate();
  const urlPathRef = useRef(useLocation().pathname);
  const firstLogin = getStorageItem("key")?.First_Login;
  let allRoutes = [
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/eip-login-handler",
      element: <EipLoginHandler />,
    },
    {
      path: "/eip-login-error",
      element: <EipLoginError />,
    },
    {
      path: "/sso-login-handler",
      element: <SsoLoginHandler />,
    },
    {
      path: "/sso-login-error",
      element: <SsoLoginError />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element:
            routers.length === 0 || firstLogin === "True" ? (
              <></>
            ) : (
              <SYSNEWS020 />
            ),
        },
        {
          path: "/IFAA/IFAA340F",
          element: <IFAA340F />,
        },
        {
          path: "/SYS/SYSNEWS020",
          element: <SYSNEWS020 />,
        },
        {
          path: "/IFAC/IFAC060F",
          element: <IFAC060F />,
        },
        {
          path: "/IFAC/IFAC080F",
          element: <IFAC080F />,
        },
      ].concat(
        routers.map((x) => {
          return x;
        }),
      ),
    },
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
        const cachedConfig = getStorageItem("systemConfig", true, null);

        if (cachedConfig) {
          // 使用已快取的配置
          applySystemConfig(cachedConfig);
        } else {
          // 獲取新的系統配置
          const response = await axios.get(
            BASEURL + "/api/Auth/GetCmpIdentify",
          );
          if (response.data) {
            const config = response.data;
            // 應用系統配置
            applySystemConfig(config[0]);
            // 儲存到 Storage
            setStorageItem(
              "systemConfig",
              config[0],
              true, // 儲存為 JSON
            );
          }
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
    BACKENDVERSION === "netCore"
      ? setRouters(handleRoutersData_netCore(menuData.menu))
      : setRouters(handleRoutersData(menuData.menu));

    if (menuData.menu.length > 0) {
      setTimeout(() => {
        if (firstLogin === "True") {
          navigate("/IFAA/IFAA340F");
        } else {
          navigate(urlPathRef.current);
        }
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
      ></div>
    );
  }

  return routes;
}

export default App;
