import { Suspense, lazy } from "react";
import axios from "axios";
import { BASEURL, BACKENDVERSION } from "/src/Common/Const.js";
import { getAuthToken } from "/src/Common/StorageService.js";

// 掃描所有頁面元件：Views/<模組>/<程式代號>.jsx
const modules = import.meta.glob("./Views/*/*");

// 簡單深拷貝（取代 lodash cloneDeep）
const deepClone = (data) => structuredClone(data);

/**
 * lazyLoad & dynamic 元件 with prog_id change detection
 * @param {string} path - 組件路徑（例如 ./Views/MTG/MTG010F）
 * @returns {JSX.Element} 包裝後的組件
 */
const LoadableComponent = (path) => {
  // 參考 https://juejin.cn/post/7218032919008624700
  // 不可直接 lazy(()=>import(路徑))，build 完 run 會找不到 js file
  let LazyComponent;
  if (!modules[`${path}.jsx`]) {
    LazyComponent = function NotFound() {
      return <div>系統找不到程式</div>;
    };
  } else {
    LazyComponent = lazy(modules[`${path}.jsx`]);
  }

  // 用 prog_id 當 key，切換不同 prog_id 時強制重新渲染整個組件
  const WrappedComponent = () => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");

    let componentKey = "default";
    if (pathParts.length >= 4) {
      const urlPath = pathParts[1];
      const progNo = pathParts[2];
      const progId = pathParts[3];
      componentKey = `${urlPath}_${progNo}_${progId}`;
    }

    return <LazyComponent key={componentKey} />;
  };

  return (
    <Suspense fallback={<div className="p-4">載入中...</div>}>
      <WrappedComponent />
    </Suspense>
  );
};

/**
 * 舊版：把 flat 選單資料整理成 Tree（給 Layout 側邊選單用）
 */
const organizeMenuTree = (menuItems, parentId = 0) => {
  const children = menuItems.filter((item) => item.parentId === parentId);
  children.forEach((child) => {
    if (child.type === "P") {
      child.url = `/${child.url_path}/${child.prog_no}/${child.prog_id}`;
    }
    child.label = child.text;
    child.id = child.ID;
    child.children = organizeMenuTree(menuItems, child.ID);
  });
  return children;
};

/**
 * netCore 版：把 Tree 選單資料補上 url（給 Layout 側邊選單用）
 */
const organizeMenuTree_netCore = (menuItems) => {
  const traverse = (items) => {
    items.forEach((item) => {
      if (item.children === null || item.children === undefined) {
        if (item.bookurl) {
          item.isExternal = true;
          item.url = item.bookurl;
        } else {
          item.url = `/${item.url_path}/${item.url}/${item.prog_id}`;
        }
      } else {
        traverse(item.children);
      }
    });
  };
  traverse(menuItems);
  return menuItems;
};

/**
 * 取得 Menu Tree 資料（給 Layout 側邊選單渲染用）
 * @param {Array} data 後端回傳的選單資料
 * @returns {Array} 帶 url 的選單樹
 */
export const handleMenuData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  const copyMenuData = deepClone(data);
  return BACKENDVERSION === "netCore"
    ? organizeMenuTree_netCore(copyMenuData)
    : organizeMenuTree(copyMenuData);
};

/**
 * 舊版：把選單資料轉成 react-router useRoutes 的 route 陣列
 * @param {Array} data
 * @returns {Array}
 */
export const handleRoutersData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  const copyMenuData = deepClone(data);
  return copyMenuData
    .filter((item) => item.type === "P")
    .map((item) => {
      const path = `/${item.url_path}/${item.prog_no}/${item.prog_id}`;
      return {
        path,
        element: LoadableComponent(`./Views${path}`),
      };
    });
};

/**
 * netCore 版：把 Tree 選單資料轉成 react-router route 陣列
 * @param {Array} data
 * @returns {Array}
 */
export const handleRoutersData_netCore = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  const copyMenuData = deepClone(data);
  const routersData = [];
  const traverse = (items) => {
    items.forEach((item) => {
      if (item.children === null || item.children === undefined) {
        // 外部連結不建立內部 Route
        if (!item.bookurl) {
          const path = `/${item.url_path}/${item.url}/${item.prog_id}`;
          routersData.push({
            path,
            element: LoadableComponent(`./Views/${item.url_path}/${item.url}`),
          });
        }
      } else {
        traverse(item.children);
      }
    });
  };
  traverse(copyMenuData);
  return routersData;
};

/**
 * 向後端取得登入者的選單資料
 * 需先登入（localStorage 有 key.accessToken）
 * @returns {Promise<Array>} 選單資料
 */
export const loadMenu = () => {
  const url =
    BACKENDVERSION === "netCore"
      ? BASEURL + "/api/apiIndex/LoadMenu"
      : BASEURL + "/api/apiindex/init";

  return axios
    .get(url, {
      headers: { Authorization: getAuthToken() },
    })
    .then((response) =>
      BACKENDVERSION === "netCore"
        ? response.data
        : response.data.masterData
    );
};
