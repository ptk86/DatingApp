using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UsersController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet(Name = "GetUsers")]
        public async Task<IActionResult> Get([FromQuery]UserParams userParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            userParams.UserId = userId;
            var currentUser = await _context.Users
                                  .Include(u => u.Likers)
                                  .Include(u => u.Likees)
                                  .FirstOrDefaultAsync(u => u.Id == userId);
            


            var users = _context.Users.Include(u => u.Photos)
                .AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);

            if (userParams.Likees && userParams.Likers)
                return BadRequest("Cannot select likers and likees at the same time");

            if (userParams.Likers)
            {
                var currentUserLikersIds = currentUser.Likers.Select(l => l.LikerId);
                users = users.Where(u => currentUserLikersIds.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var currentUserLikeesIds = currentUser.Likees.Select(l => l.LikeeId);
                users = users.Where(u => currentUserLikeesIds.Contains(u.Id));
            }

            if (!string.IsNullOrEmpty(userParams.Gender))
            {
                users = users.Where(u => u.Gender == userParams.Gender);
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            var pagedUsers = await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
            Response.AddPagination(pagedUsers.CurrentPage, pagedUsers.PageSize, pagedUsers.TotalCount, pagedUsers.TotalPages);
            return Ok(_mapper.Map<List<UserDetail>>(pagedUsers));
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == id);
            return Ok(_mapper.Map<UserDetail>(user));
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> Like(int id, int recipientId)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (id != int.Parse(tokenId))
            {
                return Unauthorized();
            }
            var user = await _context.Users.Include(u => u.Likees).FirstOrDefaultAsync(x => x.Id == id);

            if (user.Likees.Any(l => l.LikeeId == recipientId))
            {
                return BadRequest("You already like this user!");
            }

            if (_context.Users.All(u => u.Id != recipientId))
            {
                return NotFound("The recipient doesn't exist!");
            }

            user.Likees.Add(new Like
            {
                LikeeId = recipientId
            });

            await _context.SaveChangesAsync();

            return Ok("Success!");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UserUpdate dto)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (id != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            _mapper.Map(dto, user);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
