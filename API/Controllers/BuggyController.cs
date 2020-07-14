using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseController
    {
        private readonly StoreContext _ctx;

        public BuggyController(StoreContext ctx)
        {
            this._ctx = ctx;
        }
        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = _ctx.Products.Find(42);
            if(thing == null){

                return NotFound(new ApiResponse(404));
            }

            return Ok(); 
        }
         [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = _ctx.Products.Find(42);

            var thingToReturn = thing.ToString(); 
            return Ok(); 
        }
         [HttpGet("badrequest")]
        public ActionResult getBadRequest()
        {

            return BadRequest(); 
        }

        [HttpGet("badrbadrequest/{id}")]
        public ActionResult getBadRequest(int id)
        {

            return Ok(); 
        }
    }
}