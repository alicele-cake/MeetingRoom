using System.Text.Json.Serialization;

namespace back_end.Models
{
    /// <summary>
    /// 選單節點（欄位配合前端 Menus.jsx 的 netCore 版解析）
    /// - 有 children：目錄節點
    /// - children 為 null：程式節點，前端以 /url_path/url/prog_id 建立路由
    /// </summary>
    public class MenuNode
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; } = "";

        [JsonPropertyName("url_path")]
        public string? UrlPath { get; set; }

        [JsonPropertyName("url")]
        public string? Url { get; set; }

        [JsonPropertyName("prog_id")]
        public string? ProgId { get; set; }

        [JsonPropertyName("bookurl")]
        public string? BookUrl { get; set; }

        [JsonPropertyName("children")]
        public List<MenuNode>? Children { get; set; }
    }
}
