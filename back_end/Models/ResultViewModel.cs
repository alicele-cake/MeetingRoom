using System.Text.Json.Serialization;

namespace back_end.Models
{
    /// <summary>
    /// 統一 API 回傳格式 { isSuccess, message, Result }
    /// 欄位名稱刻意配合前端（isSuccess / message / Result）。
    /// </summary>
    public class ResultViewModel<T>
    {
        [JsonPropertyName("isSuccess")]
        public bool IsSuccess { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; } = "";

        [JsonPropertyName("Result")]
        public T? Result { get; set; }

        public static ResultViewModel<T> Ok(T result, string message = "") =>
            new() { IsSuccess = true, Message = message, Result = result };

        public static ResultViewModel<T> Fail(string message) =>
            new() { IsSuccess = false, Message = message, Result = default };
    }
}
