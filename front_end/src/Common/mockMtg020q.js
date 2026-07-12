// 假資料庫（會議室預約紀錄）
// 日後將下方四個函式改為 axios 呼叫後端 /api/apiMTG020Q/Query|Insert|Update|Delete 即可，
// 只要維持回傳 { success, data, message } 的形狀，MTG020Q.jsx 畫面完全無須改動。

// 記憶體中的假資料表（重新整理頁面即還原成此預設值）
let rows = [
  {
    id: 1,
    room: "第一會議室",
    date: "2026-07-12",
    startTime: "09:00",
    endTime: "10:30",
    applicant: "王小明",
    dept: "資訊部",
    subject: "系統上線前置會議",
    status: "已預約",
    memo: "需準備投影設備",
  },
  {
    id: 2,
    room: "第二會議室",
    date: "2026-07-12",
    startTime: "14:00",
    endTime: "15:00",
    applicant: "李美華",
    dept: "人資部",
    subject: "新人面談",
    status: "已完成",
    memo: "",
  },
  {
    id: 3,
    room: "視訊會議室",
    date: "2026-07-13",
    startTime: "10:00",
    endTime: "11:00",
    applicant: "陳大文",
    dept: "業務部",
    subject: "海外客戶視訊",
    status: "已預約",
    memo: "需連線越南分公司",
  },
  {
    id: 4,
    room: "第一會議室",
    date: "2026-07-14",
    startTime: "16:00",
    endTime: "17:00",
    applicant: "張雅婷",
    dept: "財務部",
    subject: "季度預算檢討",
    status: "已取消",
    memo: "改期待通知",
  },
];

// 模擬網路延遲
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// 產生下一個主鍵（用現有最大值 +1，避免 Date.now()/random 造成不可預期）
const nextId = () =>
  rows.reduce((max, r) => (r.id > max ? r.id : max), 0) + 1;

/**
 * 查詢：依 room / date / applicant / status 篩選；空條件回全部
 */
export const queryBookings = async (filters = {}) => {
  await delay();
  const { room, date, applicant, status } = filters;
  const data = rows.filter((r) => {
    if (room && r.room !== room) return false;
    if (date && r.date !== date) return false;
    if (applicant && !r.applicant.includes(applicant.trim())) return false;
    if (status && r.status !== status) return false;
    return true;
  });
  // 回傳複本，避免外部直接改到內部資料
  return { success: true, data: data.map((r) => ({ ...r })), message: "" };
};

/**
 * 新增
 */
export const insertBooking = async (record) => {
  await delay();
  const newRow = { ...record, id: nextId() };
  rows.push(newRow);
  return { success: true, data: { ...newRow }, message: "" };
};

/**
 * 修改（依 id 覆寫）
 */
export const updateBooking = async (record) => {
  await delay();
  const idx = rows.findIndex((r) => r.id === record.id);
  if (idx === -1) {
    return { success: false, data: null, message: "找不到要修改的資料" };
  }
  rows[idx] = { ...rows[idx], ...record };
  return { success: true, data: { ...rows[idx] }, message: "" };
};

/**
 * 刪除（依 id 移除）
 */
export const deleteBooking = async (id) => {
  await delay();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) {
    return { success: false, data: null, message: "找不到要刪除的資料" };
  }
  rows.splice(idx, 1);
  return { success: true, data: null, message: "" };
};

// 下拉選項（會議室、狀態）—畫面與服務層共用，日後也可改由後端提供
export const ROOM_OPTIONS = ["第一會議室", "第二會議室", "視訊會議室"];
export const STATUS_OPTIONS = ["已預約", "已完成", "已取消"];
