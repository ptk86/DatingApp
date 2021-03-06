﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using DatingApp.Api.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult> Get(int userId, [FromQuery]MessageParams messageParams)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            messageParams.UserId = userId;

            var messages = _context.Message
                .Include(m => m.Sender)
                .ThenInclude(u => u.Photos)
                .Include(m => m.Recipient)
                .ThenInclude(u => u.Photos)
                .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false && !m.IsRead);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);

            var pagedMessages =
                await PagedList<Models.Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
            var returnDtos = _mapper.Map<IEnumerable<Dto.Message>>(pagedMessages);
            Response.AddPagination(pagedMessages.CurrentPage, pagedMessages.PageSize, pagedMessages.TotalCount,
                                   pagedMessages.TotalPages);

            return Ok(returnDtos);
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

        [HttpGet("thread/{recipientId}", Name = "Thread")]
        public async Task<IActionResult> Thread(int userId, int recipientId)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var thread = await _context.Message
                             .Include(m => m.Sender)
                             .ThenInclude(r => r.Photos)
                             .Include(m => m.Recipient)
                             .ThenInclude(r => r.Photos)
                             .Where(m => m.SenderId == userId && m.RecipientId == recipientId &&
                                         m.RecipientDeleted == false ||
                                         m.RecipientId == userId && m.SenderId == recipientId &&
                                         m.SenderDeleted == false)
                             .OrderByDescending(m => m.MessageSent)
                             .ToListAsync();

            var dtos = _mapper.Map<IEnumerable<Dto.Message>>(thread);
            return Ok(dtos);
        }

        [HttpPost(Name = "CreateMessage")]
        public async Task<IActionResult> Post(int userId, MessageCreate dto)
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
            message = await _context.Message.Include(m => m.Sender)
                          .ThenInclude(r => r.Photos)
                          .Include(m => m.Recipient)
                          .ThenInclude(r => r.Photos)
                          .FirstOrDefaultAsync(m => m.Id == message.Id);
            
            var returnDto = _mapper.Map<Message>(message);

            return CreatedAtRoute("GetMessage", new {id = message.Id}, returnDto);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Delete(int id, int userId)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var message = await _context.Message.FirstOrDefaultAsync(m => m.Id == id);

            if (message.SenderId == userId)
            {
                message.SenderDeleted = true;
            }

            if (message.RecipientId == userId)
            {
                message.RecipientDeleted = true;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _context.Message.FirstOrDefaultAsync(m => m.Id == id);

            if (message.RecipientId != userId)
                return Unauthorized();

            message.IsRead = true;
            message.DateRead = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}