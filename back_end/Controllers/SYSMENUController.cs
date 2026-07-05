using back_end.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    /// <summary>
    /// 選單來源。路由為 api/apiIndex（配合前端 loadMenu 呼叫 /api/apiIndex/LoadMenu）
    /// 目前回傳固定選單樹；之後可改為依使用者權限從 DB 產生。
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class apiIndexController : ControllerBase
    {
        /// <summary>回傳登入者可見的選單樹（固定版）</summary>
        [HttpGet("LoadMenu")]
        [Authorize]
        public IActionResult LoadMenu()
        {
            var menu = new List<MenuNode>
            {
                new MenuNode
                {
                    Id = 1,
                    Text = "會議室管理",
                    Children = new List<MenuNode>
                    {
                        new MenuNode
                        {
                            Id = 11,
                            Text = "會議室登記",
                            UrlPath = "MTG",
                            Url = "MTG010F",
                            ProgId = "0",
                            Children = null,
                        },
                        new MenuNode
                        {
                            Id = 12,
                            Text = "會議室查詢",
                            UrlPath = "MTG",
                            Url = "MTG020Q",
                            ProgId = "0",
                            Children = null,
                        },
                    },
                },
                new MenuNode
                {
                    Id = 2,
                    Text = "系統管理",
                    Children = new List<MenuNode>
                    {
                        new MenuNode
                        {
                            Id = 21,
                            Text = "使用者維護",
                            UrlPath = "SYS",
                            Url = "SYS010F",
                            ProgId = "0",
                            Children = null,
                        },
                    },
                },
            };

            return Ok(menu);
        }
    }
}
