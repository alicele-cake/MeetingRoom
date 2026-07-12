// MTG020Q 會議室預約 API 客戶端
// 呼叫後端 /api/apiMTG020Q/Query|Insert|Update|Delete（記憶體假資料版）。
// 對外維持 { success, data, message } 形狀，故畫面 MTG020Q.jsx 邏輯無須改動。
// 日後後端改接真 DB 時，此檔亦無須改動（契約不變）。

import axios from "axios";
import { BASEURL } from "/src/Common/Const.js";
import { getAuthToken } from "/src/Common/StorageService.js";

const api = (action) => `${BASEURL}/api/apiMTG020Q/${action}`;

const authHeader = () => ({ headers: { Authorization: getAuthToken() } });

// 後端回傳 { isSuccess, message, Result } → 對映為 { success, data, message }
const toResult = (resp) => {
  const d = resp?.data ?? {};
  return { success: !!d.isSuccess, data: d.Result ?? null, message: d.message ?? "" };
};

const toError = (error) => ({
  success: false,
  data: null,
  message: error?.response?.data?.message ?? error?.message ?? "連線失敗",
});

/**
 * 查詢：依 room / date / applicant / status 篩選；空條件回全部
 */
export const queryBookings = async (filters = {}) => {
  try {
    const resp = await axios.post(api("Query"), filters, authHeader());
    return toResult(resp);
  } catch (error) {
    return toError(error);
  }
};

/**
 * 新增
 */
export const insertBooking = async (record) => {
  try {
    const resp = await axios.post(api("Insert"), record, authHeader());
    return toResult(resp);
  } catch (error) {
    return toError(error);
  }
};

/**
 * 修改
 */
export const updateBooking = async (record) => {
  try {
    const resp = await axios.post(api("Update"), record, authHeader());
    return toResult(resp);
  } catch (error) {
    return toError(error);
  }
};

/**
 * 刪除
 */
export const deleteBooking = async (id) => {
  try {
    const resp = await axios.post(api("Delete"), { id }, authHeader());
    return toResult(resp);
  } catch (error) {
    return toError(error);
  }
};

// 下拉選項（會議室、狀態）—畫面用；日後也可改由後端提供
export const ROOM_OPTIONS = ["第一會議室", "第二會議室", "視訊會議室"];
export const STATUS_OPTIONS = ["已預約", "已完成", "已取消"];
