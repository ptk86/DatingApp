using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.Api.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Api.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            var userId = int.Parse(resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)
                                       .Value);
            var dataContext = resultContext.HttpContext.RequestServices.GetService<DataContext>();
            var user = await dataContext.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user != null)
            {
                user.LastActive = DateTime.UtcNow;
            }

            await dataContext.SaveChangesAsync();
        }
    }
}
