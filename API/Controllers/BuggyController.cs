using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
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
        [HttpGet("testauth")]
        [Authorize]
        public ActionResult<string> GetSecretText(){
          
            return "secret stuff";
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

            return BadRequest(new ApiResponse(400)); 
        }

        [HttpGet("badrequest/{id}")]
        public ActionResult getBadRequest(int id)
        {

            return BadRequest(); 
        }
    }
}