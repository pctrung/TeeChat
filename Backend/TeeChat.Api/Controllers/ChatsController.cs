using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using TeeChat.Application.Interfaces;
using TeeChat.Hubs.Hubs;
using TeeChat.Hubs.Interfaces;
using TeeChat.Models.RequestModels.Chat;
using TeeChat.Models.RequestModels.Messages;

namespace TeeChat.Api.Controllers
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
            return result.StatusCode switch
            {
                200 => Ok(result),
                403 => Forbid(),
                404 => NotFound(result.Message),
                _ => BadRequest(result.Message),
            };
        }

        [HttpGet("{chatId:int}")]
        public async Task<IActionResult> Get(int chatId, [FromQuery] GetChatRequest request)
        {
            var result = await _chatService.GetByIdAsync(chatId, request);
            return result.StatusCode switch
            {
                200 => Ok(result.Data),
                403 => Forbid(),
                404 => NotFound(result.Message),
                _ => BadRequest(result.Message),
            };
        }

        [HttpPost("group")]
        public async Task<IActionResult> CreateGroupChatAsync(CreateGroupChatRequest request)
        {
            var result = await _chatService.CreateGroupChatAsync(request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveChat(result.Data.Chat);
                        return Created("", result.Data.Chat);
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
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveChat(result.Data.Chat);
                        return Created("", result.Data.Chat);
                    }
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPost("{chatId:int}/send")]
        public async Task<IActionResult> SendMessage(int chatId, SendMessageRequest request)
        {
            var result = await _chatService.AddMessageAsync(chatId, request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveMessage(result.Data);

                        return Created("", result);
                    };
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPost("{chatId:int}/sendImage")]
        public async Task<IActionResult> SendImage(int chatId, [FromForm] SendImageRequest request)
        {
            var result = await _chatService.AddImageAsync(chatId, request);

            switch (result.StatusCode)
            {
                case 201:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveMessage(result.Data);

                        return Created("", result);
                    };
                case 200: return Ok(result);
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPatch("{chatId:int}")]
        public async Task<IActionResult> UpdateChat(int chatId, UpdateGroupChatRequest request)
        {
            var result = await _chatService.UpdateGroupChatAsync(chatId, request);

            switch (result.StatusCode)
            {
                case 200:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveUpdatedChat(result.Data.Chat);

                        return Created("", result);
                    };
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPatch("{chatId:int}/avatar")]
        public async Task<IActionResult> UpdateAvatar(int chatId, [FromForm] UpdateGroupAvatarRequest request)
        {
            var result = await _chatService.UpdateGroupAvatarAsync(chatId, request);

            switch (result.StatusCode)
            {
                case 200:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveUpdatedGroupAvatar(result.Data);

                        return Ok(result);
                    };
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }

        [HttpPatch("{chatId:int}/read")]
        public async Task<IActionResult> ReadChatAsync(int chatId)
        {
            var result = await _chatService.ReadChatAsync(chatId);
            switch (result.StatusCode)
            {
                case 200:
                    {
                        await _chatHub.Clients.Users(result.Data.RecipientUserNames).ReceiveAddReadByUserName(result.Data);

                        return Ok(result);
                    }
                case 403: return Forbid();
                case 404: return NotFound(result.Message);
                default: return BadRequest(result.Message);
            }
        }
    }
}