using System;

namespace API.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message=null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessage(statusCode);
        } 
        public int StatusCode { get; set; }
        public string Message { get; set; }



        
        private string GetDefaultMessage(int statusCode)
        {
            return  statusCode switch  
            {
                400 => "A bad request you have made",
                401 => "Authorised you are not",
                404 => "Resource found itwas not",
                500 => "Errors are the path to the dark side. Errors lead to anger."+
                         "Anger leads to hate. Hate leads to carrear change"
                 
            };
        }


        
    }
}