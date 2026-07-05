using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using back_end.Models.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace back_end.Services
{
    /// <summary>
    /// 登入 / JWT 服務（記憶體假資料版，之後可換成真 DB）
    /// </summary>
    public class AuthService
    {
        private readonly IConfiguration _config;

        // 假使用者：帳號 -> (密碼, 顯示名稱)
        private static readonly Dictionary<string, (string Pwd, string UserNa)> _users =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["admin"] = ("1234", "系統管理員"),
                ["user"] = ("1234", "一般使用者"),
            };

        // 記憶體 refresh token 存放：refreshToken -> (userId, 到期時間)
        private static readonly ConcurrentDictionary<string, (string UserId, DateTime Expiry)> _refreshTokens =
            new();

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        /// <summary>驗證帳密並產生登入回應</summary>
        public AuthenticateResponseModel? Login(AuthenticateRequestModel req)
        {
            if (!_users.TryGetValue(req.PNO, out var user) || user.Pwd != req.PWD)
            {
                return null;
            }

            var accessToken = GenerateAccessToken(req.PNO);
            var refreshToken = GenerateRefreshToken(req.PNO);

            return new AuthenticateResponseModel
            {
                UserId = req.PNO,
                UserNa = user.UserNa,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
            };
        }

        /// <summary>用 refresh token 換發新的 access / refresh token</summary>
        public TokenApiModel? Refresh(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken) ||
                !_refreshTokens.TryGetValue(refreshToken, out var info) ||
                info.Expiry < DateTime.UtcNow)
            {
                return null;
            }

            // 舊的 refresh token 失效（rotation）
            _refreshTokens.TryRemove(refreshToken, out _);

            return new TokenApiModel
            {
                AccessToken = GenerateAccessToken(info.UserId),
                RefreshToken = GenerateRefreshToken(info.UserId),
            };
        }

        /// <summary>登出：撤銷 refresh token</summary>
        public void Logout(string? refreshToken)
        {
            if (!string.IsNullOrEmpty(refreshToken))
            {
                _refreshTokens.TryRemove(refreshToken, out _);
            }
        }

        private string GenerateAccessToken(string userId)
        {
            var jwt = _config.GetSection("JWTSettings");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwt["Key"] ?? "CHANGE_ME_TO_A_LONG_SECRET_KEY_32+"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, userId),
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var expiryMinutes = int.TryParse(jwt["ExpiryMinutes"], out var m) ? m : 120;

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken(string userId)
        {
            var jwt = _config.GetSection("JWTSettings");
            var days = int.TryParse(jwt["RefreshExpiryDays"], out var d) ? d : 7;

            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            var refreshToken = Convert.ToBase64String(randomBytes);

            _refreshTokens[refreshToken] = (userId, DateTime.UtcNow.AddDays(days));
            return refreshToken;
        }
    }
}
