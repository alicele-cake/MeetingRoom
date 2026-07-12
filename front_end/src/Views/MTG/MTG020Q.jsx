import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  queryBookings,
  insertBooking,
  updateBooking,
  deleteBooking,
  ROOM_OPTIONS,
  STATUS_OPTIONS,
} from "/src/Common/mockMtg020q.js";

/**
 * MTG020Q 會議室查詢/維護
 * 具備 查詢 / 新增 / 修改 / 刪除，資料來源目前為假資料庫 (mockMtg020q.js)，可日後替換為後端 API。
 */

// 查詢列的空白條件
const emptyFilters = { room: "", date: "", applicant: "", status: "" };
// 彈窗表單的空白預設值
const emptyForm = {
  id: null,
  room: ROOM_OPTIONS[0],
  date: "",
  startTime: "",
  endTime: "",
  applicant: "",
  dept: "",
  subject: "",
  status: STATUS_OPTIONS[0],
  memo: "",
};

// 共用樣式
const inputStyle = {
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};
const btnBase = {
  padding: "6px 14px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  color: "#fff",
};

const MTG020Q = () => {
  const { prog_id } = useParams();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ ...emptyFilters });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'edit'
  const [form, setForm] = useState({ ...emptyForm });

  // 初次載入全部
  useEffect(() => {
    handleQuery({ ...emptyFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 查詢
  const handleQuery = async (cond = filters) => {
    setLoading(true);
    try {
      const res = await queryBookings(cond);
      if (res.success) {
        setList(res.data);
      } else {
        Swal.fire("查詢失敗", res.message ?? "", "error");
      }
    } catch (e) {
      Swal.fire("查詢失敗", String(e?.message ?? e), "error");
    } finally {
      setLoading(false);
    }
  };

  // 清除查詢條件並重查
  const handleReset = () => {
    const cleared = { ...emptyFilters };
    setFilters(cleared);
    handleQuery(cleared);
  };

  // 開新增彈窗
  const handleAdd = () => {
    setModalMode("add");
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  // 開修改彈窗
  const handleEdit = (row) => {
    setModalMode("edit");
    setForm({ ...row });
    setModalOpen(true);
  };

  // 儲存（新增或修改）
  const handleSave = async () => {
    // 基本必填檢核
    if (!form.room || !form.date || !form.startTime || !form.endTime || !form.applicant) {
      Swal.fire("請完整填寫", "會議室、日期、開始/結束時間、預約人為必填", "warning");
      return;
    }
    if (form.startTime >= form.endTime) {
      Swal.fire("時間錯誤", "結束時間必須晚於開始時間", "warning");
      return;
    }

    try {
      const res =
        modalMode === "add"
          ? await insertBooking(form)
          : await updateBooking(form);

      if (res.success) {
        setModalOpen(false);
        await handleQuery();
        Swal.fire(modalMode === "add" ? "新增成功" : "修改成功", "", "success");
      } else {
        Swal.fire("儲存失敗", res.message ?? "", "error");
      }
    } catch (e) {
      Swal.fire("儲存失敗", String(e?.message ?? e), "error");
    }
  };

  // 刪除
  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: "確定刪除？",
      text: `${row.date} ${row.room} - ${row.subject}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
      confirmButtonColor: "#b91c1c",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await deleteBooking(row.id);
      if (res.success) {
        await handleQuery();
        Swal.fire("刪除成功", "", "success");
      } else {
        Swal.fire("刪除失敗", res.message ?? "", "error");
      }
    } catch (e) {
      Swal.fire("刪除失敗", String(e?.message ?? e), "error");
    }
  };

  // 彈窗欄位變更
  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      {/* 標題列 */}
      <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
        會議室查詢 (MTG020Q)
        {prog_id != null && (
          <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>
            prog_id: {prog_id}
          </span>
        )}
      </h1>

      {/* 查詢列 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "12px",
          padding: "12px",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          marginBottom: "12px",
          background: "#f9fafb",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px" }}>會議室</label>
          <select
            value={filters.room}
            onChange={(e) => setFilters({ ...filters, room: e.target.value })}
            style={inputStyle}
          >
            <option value="">全部</option>
            {ROOM_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px" }}>日期</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px" }}>預約人</label>
          <input
            type="text"
            value={filters.applicant}
            onChange={(e) => setFilters({ ...filters, applicant: e.target.value })}
            placeholder="姓名關鍵字"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px" }}>狀態</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={inputStyle}
          >
            <option value="">全部</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => handleQuery()}
          style={{ ...btnBase, background: "#1f6650" }}
        >
          查詢
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{ ...btnBase, background: "#6b7280" }}
        >
          清除
        </button>
      </div>

      {/* 工具列 */}
      <div style={{ marginBottom: "8px" }}>
        <button
          type="button"
          onClick={handleAdd}
          style={{ ...btnBase, background: "#2563eb" }}
        >
          + 新增
        </button>
      </div>

      {/* 表格 */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            minWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ background: "#1f2937", color: "#fff" }}>
              {["項次", "會議室", "日期", "時段", "預約人", "部門", "主題", "狀態", "操作"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px",
                      border: "1px solid #374151",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: "16px", textAlign: "center", border: "1px solid #e5e7eb" }}>
                  載入中...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: "16px", textAlign: "center", border: "1px solid #e5e7eb", color: "#6b7280" }}>
                  查無資料
                </td>
              </tr>
            ) : (
              list.map((row, idx) => (
                <tr key={row.id} style={{ background: idx % 2 ? "#f9fafb" : "#fff" }}>
                  <td style={cellStyle}>{idx + 1}</td>
                  <td style={cellStyle}>{row.room}</td>
                  <td style={cellStyle}>{row.date}</td>
                  <td style={cellStyle}>
                    {row.startTime} ~ {row.endTime}
                  </td>
                  <td style={cellStyle}>{row.applicant}</td>
                  <td style={cellStyle}>{row.dept}</td>
                  <td style={cellStyle}>{row.subject}</td>
                  <td style={cellStyle}>
                    <span style={statusTagStyle(row.status)}>{row.status}</span>
                  </td>
                  <td style={{ ...cellStyle, whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(row)}
                      style={{ ...btnBase, background: "#0891b2", padding: "4px 10px", marginRight: "6px" }}
                    >
                      修改
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(row)}
                      style={{ ...btnBase, background: "#b91c1c", padding: "4px 10px" }}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 新增/修改彈窗 */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "560px",
              maxWidth: "92vw",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
              {modalMode === "add" ? "新增會議室預約" : "修改會議室預約"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field label="會議室 *">
                <select
                  value={form.room}
                  onChange={(e) => setFormField("room", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="日期 *">
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setFormField("date", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="開始時間 *">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setFormField("startTime", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="結束時間 *">
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setFormField("endTime", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="預約人 *">
                <input
                  type="text"
                  value={form.applicant}
                  onChange={(e) => setFormField("applicant", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="部門">
                <input
                  type="text"
                  value={form.dept}
                  onChange={(e) => setFormField("dept", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="會議主題" full>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setFormField("subject", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </Field>

              <Field label="狀態">
                <select
                  value={form.status}
                  onChange={(e) => setFormField("status", e.target.value)}
                  style={{ ...inputStyle, width: "100%" }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="備註" full>
                <textarea
                  value={form.memo}
                  onChange={(e) => setFormField("memo", e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, width: "100%", resize: "vertical" }}
                />
              </Field>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ ...btnBase, background: "#6b7280" }}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{ ...btnBase, background: "#1f6650" }}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 表格儲存格樣式
const cellStyle = {
  padding: "8px",
  border: "1px solid #e5e7eb",
};

// 狀態標籤色
const statusTagStyle = (status) => {
  const map = {
    已預約: { bg: "#dbeafe", color: "#1d4ed8" },
    已完成: { bg: "#dcfce7", color: "#15803d" },
    已取消: { bg: "#fee2e2", color: "#b91c1c" },
  };
  const c = map[status] ?? { bg: "#e5e7eb", color: "#374151" };
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    background: c.bg,
    color: c.color,
    whiteSpace: "nowrap",
  };
};

// 彈窗欄位小元件
const Field = ({ label, full, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: full ? "1 / -1" : "auto" }}>
    <label style={{ fontSize: "13px", color: "#374151" }}>{label}</label>
    {children}
  </div>
);

export default MTG020Q;
