using back_end.Models;
using back_end.Models.Jwt;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;
        private readonly IConfiguration _config;

        public AuthController(AuthService auth, IConfiguration config)
        {
            _auth = auth;
            _config = config;
        }

        /// <summary>帳密登入，成功回傳 JWT</summary>
        [HttpPost("Login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] AuthenticateRequestModel req)
        {
            // 檢查前端帶的 Basic 授權金鑰
            if (!CheckAuthKey())
            {
                return Unauthorized(ResultViewModel<object>.Fail("授權金鑰錯誤"));
            }

            var result = _auth.Login(req);
            if (result == null)
            {
                return BadRequest(ResultViewModel<object>.Fail("帳號或密碼錯誤"));
            }

            return Ok(ResultViewModel<AuthenticateResponseModel>.Ok(result));
        }

        /// <summary>用 refresh token 換發新 token</summary>
        [HttpPost("Refresh")]
        [AllowAnonymous]
        public IActionResult Refresh([FromBody] TokenApiModel model)
        {
            var result = _auth.Refresh(model.RefreshToken);
            if (result == null)
            {
                return Unauthorized(ResultViewModel<object>.Fail("refresh token 無效或已過期"));
            }

            return Ok(ResultViewModel<TokenApiModel>.Ok(result));
        }

        /// <summary>登出（撤銷 refresh token，JWT 本身無狀態）</summary>
        [HttpPost("Logout")]
        [Authorize]
        public IActionResult Logout([FromBody] TokenApiModel? model)
        {
            _auth.Logout(model?.RefreshToken);
            return Ok(ResultViewModel<object>.Ok(new { }, "已登出"));
        }

        private bool CheckAuthKey()
        {
            var expected = _config.GetSection("JWTSettings")["AuthKey"];
            if (string.IsNullOrEmpty(expected))
            {
                return true; // 未設定就不檢查
            }

            var header = Request.Headers["Authorization"].ToString();
            // 格式：Basic <AuthKey>
            return header.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase) &&
                   header.Substring(6).Trim() == expected;
        }
    }
}
