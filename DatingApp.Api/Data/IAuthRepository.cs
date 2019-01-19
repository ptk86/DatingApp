using System.Threading.Tasks;
using DatingApp.Api.Models;

namespace DatingApp.Api.Data
{
    public interface IAuthRepository
    {
        Task<User> Register(string userName, string passowrd);
        Task<User> Login(string userName, string passowrd);
        bool UserNameExists(string userName);
    }
}