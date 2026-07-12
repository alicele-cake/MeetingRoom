using System.Text.Json.Serialization;

namespace back_end.Models.Mtg
{
    /// <summary>
    /// 會議室預約資料（欄位配合前端 MTG020Q，序列化為 camelCase）
    /// </summary>
    public class MtgBooking
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("room")]
        public string Room { get; set; } = "";

        [JsonPropertyName("date")]
        public string Date { get; set; } = "";

        [JsonPropertyName("startTime")]
        public string StartTime { get; set; } = "";

        [JsonPropertyName("endTime")]
        public string EndTime { get; set; } = "";

        [JsonPropertyName("applicant")]
        public string Applicant { get; set; } = "";

        [JsonPropertyName("dept")]
        public string Dept { get; set; } = "";

        [JsonPropertyName("subject")]
        public string Subject { get; set; } = "";

        [JsonPropertyName("status")]
        public string Status { get; set; } = "";

        [JsonPropertyName("memo")]
        public string Memo { get; set; } = "";
    }

    /// <summary>查詢條件（空字串代表不限）</summary>
    public class MtgBookingFilter
    {
        [JsonPropertyName("room")]
        public string? Room { get; set; }

        [JsonPropertyName("date")]
        public string? Date { get; set; }

        [JsonPropertyName("applicant")]
        public string? Applicant { get; set; }

        [JsonPropertyName("status")]
        public string? Status { get; set; }
    }

    /// <summary>刪除請求</summary>
    public class MtgDeleteRequest
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
    }
}
