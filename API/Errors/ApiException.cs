namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        public ApiException(int statusCode, string details,string message = null) : base(statusCode, message)
        {
            Details=details;
        }
           public ApiException(int statusCode ,string message = null) : base(statusCode, message)
        {
            
        }
            public string Details { get; set; }
    }

}