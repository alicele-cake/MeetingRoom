using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers.Login
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        [HttpGet("value")]
        public IActionResult GetValue()
        {
            return Ok(new { value = 42 });
        }
    }
}
