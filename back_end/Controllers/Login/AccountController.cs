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

n        public AccountController(IWebHostEnvironment env)
        {
            _dataFilePath = Path.Combine(env.ContentRootPath, "RuntimeData", "value.json");
            var dir = Path.GetDirectoryName(_dataFilePath);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            if (!System.IO.File.Exists(_dataFilePath))
            {
                var initial = new { value = 42 };
                System.IO.File.WriteAllText(_dataFilePath, JsonSerializer.Serialize(initial));
            }
        }

        [HttpGet("value")]
        public IActionResult GetValue()
        {
            try
            {
                var json = System.IO.File.ReadAllText(_dataFilePath);
                var doc = JsonSerializer.Deserialize<JsonElement>(json);
                if (doc.TryGetProperty("value", out var je) && je.ValueKind == JsonValueKind.Number)
                {
                    if (je.TryGetInt32(out int v))
                        return Ok(new { value = v });
                }
            }
            catch
            {
                // ignore and fall through
            }
            return Ok(new { value = 0 });
        }

        public class ValueDto { public int value { get; set; } }

n        [HttpPost("value")]
        public IActionResult SetValue([FromBody] ValueDto dto)
        {
            if (dto == null) return BadRequest();
            var obj = new { value = dto.value };
            System.IO.File.WriteAllText(_dataFilePath, JsonSerializer.Serialize(obj));
            return Ok(obj);
        }
    }
}
