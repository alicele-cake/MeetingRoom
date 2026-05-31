using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Text.Json;

namespace back_end.Controllers.Login
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly string _dataFilePath;

        public AccountController(IWebHostEnvironment env)
        {

        }

        [HttpGet("value")]
        public IActionResult GetValue(int num)
        {
            int sum_num = num + 10;
            return Ok(new { value = sum_num });
        }
    }
}
