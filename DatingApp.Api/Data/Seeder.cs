using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Api.Models;

namespace DatingApp.Api.Data
{
    public class Seeder
    {
        private readonly DataContext _context;

        public Seeder(DataContext context)
        {
            _context = context;
        }

        public void Seed()
        {
            var jsonUserData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = Newtonsoft.Json.JsonConvert.DeserializeObject<List<User>>(jsonUserData);
            foreach (var user in users)
            {
                var hashedData = CreatePasswordHash("password");
                user.PasswordHash = hashedData.hash;
                user.PasswordSalt = hashedData.salt;
                user.UserName = user.UserName.ToLower();
                _context.Users.Add(user);
            }

            _context.SaveChanges();
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
