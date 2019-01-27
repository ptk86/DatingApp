using System;
using System.Net;
using System.Threading.Tasks;
using DatingApp.Api.Dto;
using Microsoft.AspNetCore.Diagnostics;
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

                await HandleExceptionAsync(httpContext);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            context.Response.Headers.Add("Acces-Control-Expose-Headers", "Application-Error");
            context.Response.Headers.Add("Application-Error", "Application-Error");
            context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;
            var errror = context.Features.Get<IExceptionHandlerFeature>();

            return context.Response.WriteAsync(new ErrorDetails
            {
                StatusCode = context.Response.StatusCode,
                Headers = context.Request.Headers,
                Message = errror.Error.Message
            }.ToString());
        }
    }
}