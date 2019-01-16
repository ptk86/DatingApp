using System.Linq;
using System.Threading.Tasks;
using DatingApp.Api.Data;
using DatingApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Api.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string userName, string passowrd)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);

            if(user == null)
            {
                return null;
            }                
            
            if(!VerifyPasswordHash(user.PasswordHash, user.PasswordSalt, passowrd))
            {
                return null;
            }

            return user;
        }

        private bool VerifyPasswordHash(byte[] passwordHash, byte[] passwordSalt, string passowrd)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(passowrd));
                for(int i = 0; i < computedHash.Length; i++)
                {
                    if(computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public async Task<User> Register(string userName, string passowrd)
        {
            var hashData = CreatePasswordHash(passowrd);

            var userToCreate = new User
            {
                UserName = userName,
                PasswordHash = hashData.hash,
                PasswordSalt = hashData.salt
            };

            _context.Users.Add(userToCreate);
            await _context.SaveChangesAsync();

            return userToCreate;
        }

        private (byte[] hash, byte[] salt) CreatePasswordHash(string password)
        {
            byte[] hash, salt;
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

            return (hash, salt);
        }

        public bool UserNameExists(string userName)
        {
            return  _context.Users.Any(u => u.UserName == userName);
        }
    }
}