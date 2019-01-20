using Microsoft.AspNetCore.Http;

namespace DatingApp.Api.Dto
{
    public class ErrorDetails
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public IHeaderDictionary Headers { get; set; }
    }
}