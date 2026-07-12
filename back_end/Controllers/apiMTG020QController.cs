using back_end.Models;
using back_end.Models.Mtg;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    /// <summary>
    /// MTG020Q 會議室查詢／維護 API（記憶體假資料版）
    /// 路由：/api/apiMTG020Q/Query|Insert|Update|Delete
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class apiMTG020QController : ControllerBase
    {
        private readonly MtgBookingService _service;

        public apiMTG020QController(MtgBookingService service)
        {
            _service = service;
        }

        /// <summary>查詢</summary>
        [HttpPost("Query")]
        public IActionResult Query([FromBody] MtgBookingFilter? filter)
        {
            var data = _service.Query(filter);
            return Ok(ResultViewModel<List<MtgBooking>>.Ok(data));
        }

        /// <summary>新增</summary>
        [HttpPost("Insert")]
        public IActionResult Insert([FromBody] MtgBooking record)
        {
            var created = _service.Insert(record);
            return Ok(ResultViewModel<MtgBooking>.Ok(created));
        }

        /// <summary>修改</summary>
        [HttpPost("Update")]
        public IActionResult Update([FromBody] MtgBooking record)
        {
            var updated = _service.Update(record);
            if (updated == null)
            {
                return Ok(ResultViewModel<MtgBooking>.Fail("找不到要修改的資料"));
            }
            return Ok(ResultViewModel<MtgBooking>.Ok(updated));
        }

        /// <summary>刪除</summary>
        [HttpPost("Delete")]
        public IActionResult Delete([FromBody] MtgDeleteRequest request)
        {
            var ok = _service.Delete(request.Id);
            if (!ok)
            {
                return Ok(ResultViewModel<object>.Fail("找不到要刪除的資料"));
            }
            return Ok(ResultViewModel<object>.Ok(new { }, "刪除成功"));
        }
    }
}
