using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleWare
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleWare> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleWare(RequestDelegate next, ILogger<ExceptionMiddleWare> logger,IHostEnvironment env)
        {
            this._next = next;
            this._logger = logger;
            this._env = env;
        }

        public async Task InvokeAsync(HttpContext context){
                try
                {

                 await _next(context);

                }catch(Exception e)
                {
                    _logger.LogError(e,e.Message);
                    context.Response.ContentType="application/json";
                    context.Response.StatusCode =(int)HttpStatusCode.InternalServerError;
                    var response = _env.IsDevelopment()
                                    ?new ApiException((int)HttpStatusCode.InternalServerError,
                                    e.Message, e.StackTrace.ToString()): new ApiException((int)HttpStatusCode.InternalServerError);
                  var options=new JsonSerializerOptions()
                  { 
                      PropertyNamingPolicy= JsonNamingPolicy.CamelCase
 
                  };
                  var json = JsonSerializer.Serialize(response,options);

                  await context.Response.WriteAsync(json);
                }


        }
    }
}