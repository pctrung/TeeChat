using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeeChat.Application.Identity;
using TeeChat.Application.Interfaces;
using TeeChat.Data.EF;
using TeeChat.Data.Entities;
using TeeChat.Models.Common;
using TeeChat.Models.Common.Enums;
using TeeChat.Models.RequestModels.Chat;
using TeeChat.Models.RequestModels.Messages;
using TeeChat.Models.ResponseModels.Chats;
using TeeChat.Models.ResponseModels.Messages;
using TeeChat.Models.ViewModels;
using TeeChat.Utilities.Extentions;

namespace TeeChat.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly TeeChatDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICurrentUser _currentUser;
        private const int DEFAULT_LIMIT = 30;

        public ChatService(IMapper mapper, TeeChatDbContext context, ICurrentUser currentUser)
        {
            _context = context;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<SendMessageResponse>> AddMessageAsync(int chatId, SendMessageRequest request)
        {
            var isHaveAccess = await IsHaveAccessChatAsync(chatId);
            if (!isHaveAccess)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
            }

            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Content cannot be null or empty"
                };
            }

            var chat = await _context.Chats.Include(x => x.Participants).Where(x => x.Id == chatId).FirstOrDefaultAsync();
            if (chat == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with Id: " + chatId
                };
            }

            var senderId = _currentUser.UserId;
            if (senderId == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            var sender = await _context.Users.FindAsync(senderId);
            var newMessage = new Message()
            {
                Sender = sender,
                Chat = chat,
                Content = request.Content,
                DateCreated = DateTime.Now,
            };

            await _context.Messages.AddAsync(newMessage);

            await _context.SaveChangesAsync();

            var result = new SendMessageResponse()
            {
                ChatId = chat.Id,
                Message = _mapper.Map<MessageViewModel>(newMessage),
                ParticipantUserNames = chat.Participants.Select(x => x.UserName).ToList()
            };

            return new ApiResult<SendMessageResponse>(result)
            {
                StatusCode = 201,
                Message = "Create message successfully"
            };
        }

        public async Task<ApiResult<CreateChatResponse>> CreateGroupChatAsync(CreateGroupChatRequest request)
        {
            if (request.ParticipantUserNames.Count < 2)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Group chat participant require at least 3 people"
                };
            }

            // add participants
            var participants = await _context.Users.Where(x => request.ParticipantUserNames.Contains(x.UserName)).ToListAsync();

            if (participants == null)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found any participants"
                };
            }
            else if (participants.Count < 2)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Group chat participant require at least 3 people"
                };
            }

            var currentUser = await _context.Users.FindAsync(_currentUser.UserId);
            if (currentUser == null)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            var chat = new Chat();
            chat.Type = ChatType.GROUP;
            chat.Participants = participants;
            chat.Participants.Add(currentUser);
            chat.CreatorUserName = _currentUser.UserName;
            chat.DateCreated = DateTime.Now;
            chat.Name = request.Name;

            await _context.Chats.AddAsync(chat);

            await _context.SaveChangesAsync();

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    ParticipantUserNames = chat.Participants.Select(x => x.UserName).ToList()
                };

                return new ApiResult<CreateChatResponse>(result)
                {
                    StatusCode = 201,
                    Message = "Create message successfully"
                };
            }
            else
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Cannot save chat"
                };
            }
        }

        public async Task<ApiResult<CreateChatResponse>> CreatePrivateChatAsync(CreatePrivateChatRequest request)
        {
            // add participants
            var participant = await _context.Users.Where(x => request.ParticipantUserName.Equals(x.UserName)).FirstOrDefaultAsync();

            if (participant == null)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found user with username: " + request.ParticipantUserName
                };
            }

            var currentUser = await _context.Users.FindAsync(_currentUser.UserId);
            if (currentUser == null)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            var isExists = _context.Chats.Where(x => x.Type == ChatType.PRIVATE).Any(x => x.Participants.Contains(currentUser) && x.Participants.Contains(participant));

            if (isExists)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Already exists chat with username: " + request.ParticipantUserName
                };
            }

            var chat = new Chat();
            chat.Type = ChatType.PRIVATE;
            chat.Participants = new List<AppUser>() { participant };
            chat.Participants.Add(currentUser);
            chat.CreatorUserName = _currentUser.UserName;
            chat.DateCreated = DateTime.Now;

            await _context.Chats.AddAsync(chat);

            await _context.SaveChangesAsync();

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    ParticipantUserNames = chat.Participants.Select(x => x.UserName).ToList()
                };

                return new ApiResult<CreateChatResponse>(result)
                {
                    StatusCode = 201,
                    Message = "Create message successfully"
                };
            }
            else
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Cannot save chat"
                };
            }
        }

        public async Task<ApiResult<ChatViewModel>> GetByIdAsync(int id, GetChatRequest request)
        {
            var isHaveAccess = await IsHaveAccessChatAsync(id);
            if (!isHaveAccess)
            {
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
            }
            var chat = await _context.Chats
                .Include(x => x.Messages.OrderBy(x => x.DateCreated))
                .Include(x => x.Participants)
                .Where(x => x.Id == id)
                .AsSplitQuery()
                .OrderBy(x => x.DateCreated)
                .FirstOrDefaultAsync();

            chat.Messages = chat.Messages.AsQueryable().Where(x => x.Content.Contains(request.Keyword ?? "")).Paged(request.Page, DEFAULT_LIMIT).ToList();

            if (chat == null)
            {
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + id
                };
            }
            else
            {
                var result = _mapper.Map<ChatViewModel>(chat);
                return new ApiResult<ChatViewModel>(result)
                {
                    StatusCode = 200,
                    Message = "Get chat successfully, id: " + id
                };
            }
        }

        public async Task<ApiResult<List<ChatViewModel>>> GetAllAsync()
        {
            var user = await _context.Users.FindAsync(_currentUser.UserId);

            if (user == null)
            {
                return new ApiResult<List<ChatViewModel>>(null)
                {
                    StatusCode = 404,
                    Message = "Not found user with username: " + _currentUser.UserName
                };
            }

            var query = _context.Chats
                .Where(x => x.Participants.Contains(user))
                .Include(x => x.Participants)
                .Include(x => x.Messages.OrderBy(x => x.DateCreated))
                .OrderBy(x => x.DateCreated)
                .AsSplitQuery();

            // get all chat just take page 1 of every chat
            await query.ForEachAsync(x => { x.Messages.AsQueryable().Paged(1, DEFAULT_LIMIT).ToList(); });

            var chats = await query.ToListAsync();

            if (!chats.Any())
            {
                var result = new ApiResult<List<ChatViewModel>>(null)
                {
                    StatusCode = 404,
                    Message = "Not found any chats"
                };
                return result;
            }
            else
            {
                var chatViewModel = _mapper.Map<List<ChatViewModel>>(chats);
                var result = new ApiResult<List<ChatViewModel>>(chatViewModel)
                {
                    StatusCode = 200,
                    Message = "Get chat successfully"
                };
                return result;
            }
        }

        private async Task<bool> IsHaveAccessChatAsync(int chatId)
        {
            var user = await _context.Users.FindAsync(_currentUser.UserId);

            if (user == null)
            {
                return false;
            }

            var result = _context.Chats.Where(x => x.Participants.Contains(user)).Any(x => x.Id == chatId);

            return result;
        }
    }
}