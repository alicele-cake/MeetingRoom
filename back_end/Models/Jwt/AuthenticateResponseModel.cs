using System.Text.Json.Serialization;

namespace back_end.Models.Jwt
{
    /// <summary>
    /// 登入回應（放在 ResultViewModel.Result 內）
    /// 欄位名稱配合前端：userId / userNa / accessToken / refreshToken
    /// </summary>
    public class AuthenticateResponseModel
    {
        [JsonPropertyName("userId")]
        public string UserId { get; set; } = "";

        [JsonPropertyName("userNa")]
        public string UserNa { get; set; } = "";

        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; } = "";

        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; } = "";
    }
}
