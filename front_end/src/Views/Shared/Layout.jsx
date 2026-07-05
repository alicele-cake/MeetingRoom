import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleMenuData, loadMenu } from "/src/Menus.jsx";
import { setMenuData, setLogout } from "/src/Redux/slice/Menu.js";
import {
  getStorageItem,
  removeStorageItem,
} from "/src/Common/StorageService.js";

/**
 * 登入後的共用外框：header + 側邊選單 + 內容區 (Outlet)
 */
const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuData = useSelector((x) => x.menu);
  const user = getStorageItem("key");

  // 未登入導回登入頁；已登入但尚無選單則載入選單
  useEffect(() => {
    if (!user) {
      navigate("/Login");
      return;
    }
    if (menuData.menu.length === 0) {
      loadMenu()
        .then((data) => dispatch(setMenuData(data)))
        .catch((error) => console.error("載入選單失敗:", error));
    }
  }, []);

  const logout = () => {
    dispatch(setLogout());
    removeStorageItem("key");
    navigate("/Login");
  };

  // 遞迴渲染選單樹
  const renderMenu = (items) =>
    items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      if (hasChildren) {
        return (
          <li key={item.id ?? item.text} className="menu-group">
            <div className="menu-group-title">{item.label ?? item.text}</div>
            <ul>{renderMenu(item.children)}</ul>
          </li>
        );
      }
      return (
        <li key={item.id ?? item.url}>
          <button
            type="button"
            className="menu-link"
            onClick={() =>
              item.isExternal
                ? window.open(item.url, "_blank")
                : navigate(item.url)
            }
          >
            {item.label ?? item.text}
          </button>
        </li>
      );
    });

  const menuTree = handleMenuData(menuData.menu);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          background: "#1f2937",
          color: "#fff",
          padding: "16px",
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "16px" }}>
          會議室登記系統
        </div>
        <nav>
          <ul className="menu-tree">{renderMenu(menuTree)}</ul>
        </nav>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            height: "48px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 16px",
            gap: "12px",
          }}
        >
          <span>{user?.userNa ?? user?.PNO ?? "使用者"}</span>
          <button type="button" onClick={logout}>
            登出
          </button>
        </header>

        <main style={{ flex: 1, padding: "16px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
