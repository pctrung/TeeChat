﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using TeeChat.Application.Interfaces;
using TeeChat.Hubs.Hubs;
using TeeChat.Hubs.Interfaces;
using TeeChat.Models.RequestModels.Chat;
using TeeChat.Models.RequestModels.Messages;

namespace TeeChat.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChatsController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub, IChatClient> _chatHub;

        public ChatsController(IChatService chatService, IHubContext<ChatHub, IChatClient> chatHub)
        {
            _chatService = chatService;
            _chatHub = chatHub;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _chatService.GetAllAsync();
            switch (result.StatusCode)
            {
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, [FromQuery] GetChatRequest request)
        {
            var result = await _chatService.GetByIdAsync(id, request);
            switch (result.StatusCode)
            {
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPost("group")]
        public async Task<IActionResult> CreateGroupChatAsync(CreateGroupChatRequest request)
        {
            var result = await _chatService.CreateGroupChatAsync(request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.ParticipantUserNames).ReceiveChat(result.Data);
                        return Created("", result);
                    }
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPost("private")]
        public async Task<IActionResult> CreatePrivateChatAsync(CreatePrivateChatRequest request)
        {
            var result = await _chatService.CreatePrivateChatAsync(request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.ParticipantUserNames).ReceiveChat(result.Data);
                        return Created("", result);
                    }
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPost("{id:int}/send")]
        public async Task<IActionResult> SendMessage(int id, SendMessageRequest request)
        {
            var result = await _chatService.AddMessageAsync(id, request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.ParticipantUserNames).ReceiveMessage(result.Data);

                        return Created("", result);
                    };
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }
    }
}