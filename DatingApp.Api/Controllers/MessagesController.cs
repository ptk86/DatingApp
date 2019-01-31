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
using Message = DatingApp.Api.Dto.Message;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController : Controller
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessagesController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok(await _context.Values.ToListAsync());
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> Get(int userId, int id)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            return Ok(await _context.Message.FirstOrDefaultAsync(m => m.Id == id));
        }

        [HttpPost(Name = "CreateMessage")]
        public async Task<IActionResult> Post(int userId, Message dto)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            dto.SenderId = userId;

            var recipient = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.RecipientId);

            if (recipient == null)
            {
                return BadRequest("Cannot find recipient!");
            }

            var message = _mapper.Map<Models.Message>(dto);
            _context.Message.Add(message);
            await _context.SaveChangesAsync();
            var returnDto = _mapper.Map<Message>(message);

            return CreatedAtRoute("GetMessage", new {id = message.Id}, returnDto);
        }

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id) { }
    }
}