import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASEURL, BACKENDVERSION } from "/src/Common/Const.js";
import { setStorageItem, getStorageItem } from "/src/Common/StorageService.js";

/**
 * 帳密登入頁
 */
const Login = () => {
  const [account, setAccount] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  // 已登入則直接導回首頁
  useEffect(() => {
    if (getStorageItem("key")) {
      navigate("/");
    }
  }, []);

  const login = () => {
    if (!account || !pwd) {
      Swal.fire("請輸入帳號與密碼", "", "warning");
      return;
    }

    const url =
      BACKENDVERSION === "netCore"
        ? BASEURL + "/api/Auth/Login"
        : BASEURL + "/Token";
    const postData =
      BACKENDVERSION === "netCore"
        ? { PNO: account, PWD: pwd, LoginType: "0", SSO: "0" }
        : { PASS_NO: account, PASS_WD: pwd };

    axios
      .post(url, postData, {
        headers: { authorization: "Basic a3NpOjA0MjI2MzM5Njg=" },
      })
      .then((response) => {
        const { Result, ...rest } = response.data;
        setStorageItem("key", { ...Result, ...rest });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire("登入失敗", error?.response?.data?.message ?? "", "error");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "8px",
        background: "#f3f4f6",
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          minWidth: "320px",
          padding: "40px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 8px 22px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          會議室登記系統
        </h1>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>帳號</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>密碼</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="button"
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            color: "#fff",
            background: "#1f6650",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          登入
        </button>
      </div>
    </div>
  );
};

export default Login;
