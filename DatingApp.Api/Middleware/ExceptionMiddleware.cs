using System;
using System.Net;
using System.Threading.Tasks;
using DatingApp.Api.Dto;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Acces-Control-Expose-Headers", "application error");
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

            return context.Response.WriteAsync(new ErrorDetails
            {
                StatusCode = context.Response.StatusCode,
                Headers = context.Request.Headers,
                Message = "Internal Server Error from the custom middleware."
            }.ToString());
        }
    }
}