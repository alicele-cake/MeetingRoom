namespace back_end.Models.Jwt
{
    /// <summary>
    /// 登入請求（欄位配合前端 Login.jsx 送出的內容）
    /// </summary>
    public class AuthenticateRequestModel
    {
        public string PNO { get; set; } = "";   // 帳號
        public string PWD { get; set; } = "";   // 密碼
        public string? CODE { get; set; }       // 驗證碼（本骨架未使用）
        public string? sessionId { get; set; }  // 驗證碼 session（本骨架未使用）
        public string? LoginType { get; set; }  // 0:系統帳號
        public string? SSO { get; set; }        // 0:非 SSO
    }
}
