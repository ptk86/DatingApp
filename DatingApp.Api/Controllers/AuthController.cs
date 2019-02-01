using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository authRepository, IConfiguration configuration, IMapper mapper)
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreate userCreate)
        {
            var user = _mapper.Map<User>(userCreate);
            await _authRepository.Register(user, userCreate.Password);

            var userToReturn = _mapper.Map<UserDetail>(user);
            
            return CreatedAtRoute("GetUser", new { controller = "Users", id = user.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser loginUser)
        {
            var user = await _authRepository.Login(loginUser.UserName, loginUser.Password);

            if (user == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token")
                                           .Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptior = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptior);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}