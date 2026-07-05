using System.Text.Json.Serialization;

namespace back_end.Models.Jwt
{
    /// <summary>
    /// Refresh token 換發用的請求 / 回應
    /// </summary>
    public class TokenApiModel
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; } = "";

        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; } = "";
    }
}
