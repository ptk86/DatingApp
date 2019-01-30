using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName.ToLower());

            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(user.PasswordHash, user.PasswordSalt, passowrd))
            {
                return null;
            }

            return user;
        }

        public async Task Register(User user, string passowrd)
        {
            var hashData = CreatePasswordHash(passowrd);
            
            user.PasswordHash = hashData.hash;
            user.PasswordSalt = hashData.salt;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public bool UserNameExists(string userName)
        {
            return _context.Users.Any(u => u.UserName == userName);
        }

        private bool VerifyPasswordHash(byte[] passwordHash, byte[] passwordSalt, string passowrd)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(passowrd));
                for (var i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        private (byte[] hash, byte[] salt) CreatePasswordHash(string password)
        {
            byte[] hash, salt;
            using (var hmac = new HMACSHA512())
            {
                salt = hmac.Key;
                hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }

            return (hash, salt);
        }
    }
}