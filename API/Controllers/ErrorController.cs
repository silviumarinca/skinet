using API.Errors;
using Microsoft.AspNetCore.Components; 
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{


    [Microsoft.AspNetCore.Mvc.Route("errors/{code}")]
    [ApiExplorerSettings(IgnoreApi=true)]
    public class ErrorController:BaseController
    {
        
        public IActionResult Error(int code){

            return new ObjectResult(new ApiResponse(code));

        }
    }
}