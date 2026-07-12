using back_end.Models.Mtg;

namespace back_end.Services
{
    /// <summary>
    /// 會議室預約資料服務（記憶體假資料版，之後可換成真 DB）
    /// 日後只要把下列方法改為真實資料存取（EF Core / Dapper），Controller 與前端皆無須改動。
    /// </summary>
    public class MtgBookingService
    {
        private readonly object _lock = new();

        // 記憶體資料表（後端重啟即還原成此種子資料）
        private readonly List<MtgBooking> _rows = new()
        {
            new MtgBooking { Id = 1, Room = "第一會議室", Date = "2026-07-12", StartTime = "09:00", EndTime = "10:30", Applicant = "王小明", Dept = "資訊部", Subject = "系統上線前置會議", Status = "已預約", Memo = "需準備投影設備" },
            new MtgBooking { Id = 2, Room = "第二會議室", Date = "2026-07-12", StartTime = "14:00", EndTime = "15:00", Applicant = "李美華", Dept = "人資部", Subject = "新人面談", Status = "已完成", Memo = "" },
            new MtgBooking { Id = 3, Room = "視訊會議室", Date = "2026-07-13", StartTime = "10:00", EndTime = "11:00", Applicant = "陳大文", Dept = "業務部", Subject = "海外客戶視訊", Status = "已預約", Memo = "需連線越南分公司" },
            new MtgBooking { Id = 4, Room = "第一會議室", Date = "2026-07-14", StartTime = "16:00", EndTime = "17:00", Applicant = "張雅婷", Dept = "財務部", Subject = "季度預算檢討", Status = "已取消", Memo = "改期待通知" },
        };

        /// <summary>查詢：依 room / date / applicant / status 篩選；空條件回全部</summary>
        public List<MtgBooking> Query(MtgBookingFilter? filter)
        {
            lock (_lock)
            {
                IEnumerable<MtgBooking> q = _rows;

                if (filter != null)
                {
                    if (!string.IsNullOrWhiteSpace(filter.Room))
                        q = q.Where(r => r.Room == filter.Room);
                    if (!string.IsNullOrWhiteSpace(filter.Date))
                        q = q.Where(r => r.Date == filter.Date);
                    if (!string.IsNullOrWhiteSpace(filter.Applicant))
                        q = q.Where(r => r.Applicant.Contains(filter.Applicant.Trim()));
                    if (!string.IsNullOrWhiteSpace(filter.Status))
                        q = q.Where(r => r.Status == filter.Status);
                }

                // 回傳複本，避免外部直接改到內部資料
                return q.Select(Clone).ToList();
            }
        }

        /// <summary>新增（id = 現有最大值 +1）</summary>
        public MtgBooking Insert(MtgBooking record)
        {
            lock (_lock)
            {
                var newRow = Clone(record);
                newRow.Id = _rows.Count == 0 ? 1 : _rows.Max(r => r.Id) + 1;
                _rows.Add(newRow);
                return Clone(newRow);
            }
        }

        /// <summary>修改（依 id 覆寫，找不到回 null）</summary>
        public MtgBooking? Update(MtgBooking record)
        {
            lock (_lock)
            {
                var existing = _rows.FirstOrDefault(r => r.Id == record.Id);
                if (existing == null)
                {
                    return null;
                }

                existing.Room = record.Room;
                existing.Date = record.Date;
                existing.StartTime = record.StartTime;
                existing.EndTime = record.EndTime;
                existing.Applicant = record.Applicant;
                existing.Dept = record.Dept;
                existing.Subject = record.Subject;
                existing.Status = record.Status;
                existing.Memo = record.Memo;

                return Clone(existing);
            }
        }

        /// <summary>刪除（依 id 移除，找不到回 false）</summary>
        public bool Delete(int id)
        {
            lock (_lock)
            {
                var existing = _rows.FirstOrDefault(r => r.Id == id);
                if (existing == null)
                {
                    return false;
                }
                _rows.Remove(existing);
                return true;
            }
        }

        private static MtgBooking Clone(MtgBooking r) => new()
        {
            Id = r.Id,
            Room = r.Room,
            Date = r.Date,
            StartTime = r.StartTime,
            EndTime = r.EndTime,
            Applicant = r.Applicant,
            Dept = r.Dept,
            Subject = r.Subject,
            Status = r.Status,
            Memo = r.Memo,
        };
    }
}
