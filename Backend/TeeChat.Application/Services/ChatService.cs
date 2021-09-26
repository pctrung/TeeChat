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
        private readonly AppUser _currentUser;
        private readonly IStorageService _storageService;
        private const int DEFAULT_LIMIT = 30;

        public ChatService(IMapper mapper, TeeChatDbContext context, ICurrentUser currentUser, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
            _mapper = mapper;

            _currentUser = _context.Users.Find(currentUser.UserId);

            if (_currentUser == null)
            {
                throw new Exception("Cannot get current user. Something went wrong!");
            }
        }

        public async Task<ApiResult<SendMessageResponse>> AddMessageAsync(int chatId, SendMessageRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .AsSplitQuery()
                .OrderByDescending(x => x.DateCreated)
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return ApiResult<SendMessageResponse>.BadRequest(null, "Not found chat with Id: " + chatId);
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<SendMessageResponse>.ForBid(null, "You do not have permission to access this chat");
            }

            if (string.IsNullOrWhiteSpace(request.Content))
            {
                return ApiResult<SendMessageResponse>.BadRequest(null, "Content cannot be null or empty");
            }

            var sender = _currentUser;

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
                RecipientUserNames = chat.Participants.Select(x => x.UserName).ToList()
            };

            return ApiResult<SendMessageResponse>.Created(result, "Send message successfully");
        }

        public async Task<ApiResult<CreateChatResponse>> CreateGroupChatAsync(CreateGroupChatRequest request)
        {
            if (request.ParticipantUserNames.Count < 2)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Group chat participant require at least 3 people");
            }
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Please enter group name");
            }

            // add participants
            var participants = await _context.Users
                .Where(x => !x.UserName.Equals(_currentUser.UserName) && request.ParticipantUserNames.Contains(x.UserName))
                .ToListAsync();

            if (participants == null)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Not found any participants");
            }
            else if (participants.Count < 2)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Group chat participant require at least 3 people");
            }

            var chat = new Chat
            {
                Type = ChatType.Group,
                Participants = participants
            };
            chat.Participants.Add(_currentUser);
            chat.Creator = _currentUser;
            chat.DateCreated = DateTime.Now;
            chat.Name = request.Name.Trim();

            await _context.Chats.AddAsync(chat);

            await _context.SaveChangesAsync();

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    RecipientUserNames = chat.Participants.Select(x => x.UserName).ToList()
                };

                return ApiResult<CreateChatResponse>.Created(result, "Create chat successfully");
            }
            else
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Cannot create chat. Something when wrong!");
            }
        }

        public async Task<ApiResult<CreateChatResponse>> CreatePrivateChatAsync(CreatePrivateChatRequest request)
        {
            // add participants
            var participant = await _context.Users.FirstOrDefaultAsync(x => request.ParticipantUserName.Equals(x.UserName));

            if (participant == null)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Not found user: " + request.ParticipantUserName);
            }

            var chat = await _context.Chats.FirstOrDefaultAsync(x => x.Type == ChatType.Private && x.Participants.Contains(_currentUser) && x.Participants.Contains(participant));

            bool isExistChat = chat != null;

            if (!isExistChat)
            {
                chat = new Chat
                {
                    Type = ChatType.Private,
                    Participants = new List<AppUser>() { participant }
                };
                chat.Participants.Add(_currentUser);
                chat.Creator = _currentUser;
                chat.DateCreated = DateTime.Now;
                await _context.Chats.AddAsync(chat);
                await _context.SaveChangesAsync();
            }

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    RecipientUserNames = isExistChat ? new List<string> { _currentUser.UserName } : chat.Participants.Select(x => x.UserName).ToList()
                };

                return ApiResult<CreateChatResponse>.Created(result, "Create chat successfully");
            }
            else
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Cannot create chat. Something went wrong!");
            }
        }

        public async Task<ApiResult<ChatViewModel>> GetByIdAsync(int chatId, GetChatRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .ThenInclude(x => x.ReadByUsers)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return ApiResult<ChatViewModel>.NotFound(null, "Not found chat with id: " + chatId);
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<ChatViewModel>.ForBid(null, "You do not have permission to access this chat");
            }

            chat.Messages = chat.Messages.AsQueryable().Where(x => string.IsNullOrEmpty(x.Content) || x.Content.Contains(request.Keyword ?? "")).ToList();

            var numOfUnreadMessages = chat.Messages.Where(x => !x.ReadByUsers.Contains(_currentUser)).Count();

            var totalMessage = chat.Messages.Count;
            var pageCount = (double)totalMessage / DEFAULT_LIMIT;
            var totalPage = (int)Math.Ceiling(pageCount);

            request.Page = request.Page > 0 ? request.Page : 1;
            request.Page = request.Page <= totalPage ? request.Page : totalPage;
            chat.Messages = chat.Messages.AsQueryable().OrderByDescending(x => x.DateCreated).Paged(request.Page, DEFAULT_LIMIT).ToList();

            var lastMessage = chat.Messages.LastOrDefault();
            var readByUserNames = lastMessage?.ReadByUsers.Select(x => x.UserName).ToList();

            var result = _mapper.Map<ChatViewModel>(chat);
            result.Keyword = request.Keyword;
            result.Page = request.Page;
            result.Limit = DEFAULT_LIMIT;
            result.TotalRecords = totalMessage;
            result.NumOfUnreadMessages = numOfUnreadMessages;
            result.ReadByUserNames = readByUserNames;

            return ApiResult<ChatViewModel>.Ok(result, "Get chat successfully, id: " + chatId);
        }

        public async Task<ApiResult<List<ChatViewModel>>> GetAllAsync()
        {
            var query = _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .ThenInclude(x => x.ReadByUsers)
                .OrderBy(x => x.DateCreated)
                .AsSplitQuery();

            var chats = await query.Where(x => x.Participants.Contains(_currentUser)).ToListAsync();

            var numOfUnreadMessagesByChatId = new Dictionary<int, int>();
            var readByUserNamesByChatId = new Dictionary<int, List<string>>();

            chats.ForEach(x =>
            {
                var numOfUnreadMessages = x.Messages.Where(x => !x.ReadByUsers.Contains(_currentUser)).Count();
                numOfUnreadMessagesByChatId.Add(x.Id, numOfUnreadMessages);

                var lastMessage = x.Messages.LastOrDefault();
                readByUserNamesByChatId.Add(x.Id, lastMessage?.ReadByUsers.Select(x => x.UserName).ToList());
            });

            var chatViewModel = new List<ChatViewModel>();

            if (chats.Any())
            {
                chatViewModel = _mapper.Map<List<ChatViewModel>>(chats);
            }

            // get all chat just take page 1 of every chat
            chatViewModel.ForEach(x =>
            {
                x.Keyword = "";
                x.Page = 1;
                x.Limit = DEFAULT_LIMIT;
                x.TotalRecords = x.Messages.Count;
                x.Messages = x.Messages.AsQueryable().OrderByDescending(x => x.DateCreated).Paged(1, DEFAULT_LIMIT).ToList();
                x.NumOfUnreadMessages = numOfUnreadMessagesByChatId[x.Id];
                x.ReadByUserNames = readByUserNamesByChatId[x.Id];
            });

            var result = ApiResult<List<ChatViewModel>>.Ok(chatViewModel, "Get chat successfully");

            return result;
        }

        public async Task<ApiResult<CreateChatResponse>> UpdateGroupChatAsync(int chatId, UpdateGroupChatRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .ThenInclude(x => x.ReadByUsers)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "Not found chat with id: " + chatId);
            }
            if (chat.Type == ChatType.Private)
            {
                return ApiResult<CreateChatResponse>.BadRequest(null, "You can only update group chat");
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<CreateChatResponse>.ForBid(null, "You do not have permission to access this chat");
            }

            if (!string.IsNullOrWhiteSpace(request.NewGroupName))
            {
                chat.Name = request.NewGroupName.Trim();
            }
            // notify all participant about updated chat
            var participantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList();
            request.ParticipantUserNamesToAdd.ForEach(x => participantUserNamesToNotify.Add(x));
            request.ParticipantUserNamesToRemove.ForEach(x => participantUserNamesToNotify.Add(x));

            if (request.ParticipantUserNamesToAdd != null)
            {
                foreach (var userName in request.ParticipantUserNamesToAdd)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName.Equals(userName));
                    if (chat.Participants.Contains(user))
                    {
                        continue;
                    }
                    if (user == null)
                    {
                        return ApiResult<CreateChatResponse>.BadRequest(null, "Not found user: " + userName);
                    }
                    chat.Participants.Add(user);
                }
            }
            if (request.ParticipantUserNamesToRemove != null)
            {
                foreach (var userName in request.ParticipantUserNamesToRemove)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName.Equals(userName));
                    if (user == null)
                    {
                        return ApiResult<CreateChatResponse>.BadRequest(null, "Not found user: " + userName);
                    }
                    chat.Participants.Remove(user);
                }
            }

            await _context.SaveChangesAsync();

            var result = new CreateChatResponse()
            {
                Chat = _mapper.Map<ChatViewModel>(chat),
                RecipientUserNames = participantUserNamesToNotify
            };

            return ApiResult<CreateChatResponse>.Ok(result, "Update chat successfully");
        }

        private bool IsHavePermissionToAccessChatAsync(Chat chat)
        {
            var result = chat.Participants.Contains(_currentUser);
            return result;
        }

        public async Task<ApiResult<UpdateGroupAvatarResponse>> UpdateGroupAvatarAsync(int chatId, UpdateGroupAvatarRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return ApiResult<UpdateGroupAvatarResponse>.BadRequest(null, "Not found chat with id: " + chatId);
            }
            if (chat.Type == ChatType.Private)
            {
                return ApiResult<UpdateGroupAvatarResponse>.BadRequest(null, "You can only update group chat");
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<UpdateGroupAvatarResponse>.ForBid(null, "You do not have permission to access this chat");
            }
            if (request.Avatar != null)
            {
                try
                {
                    var fileName = await _storageService.SaveImageAsync(request.Avatar);

                    if (!string.IsNullOrWhiteSpace(fileName))
                    {
                        if (!string.IsNullOrWhiteSpace(chat.AvatarFileName))
                        {
                            var currentFileName = chat.AvatarFileName;
                            await _storageService.DeleteFileAsync(currentFileName);
                        }
                        chat.AvatarFileName = fileName;

                        await _context.SaveChangesAsync();

                        var result = new UpdateGroupAvatarResponse()
                        {
                            ChatId = chat.Id,
                            GroupAvatarUrl = _storageService.GetImageUrl(fileName),
                            RecipientUserNames = chat.Participants.Select(x => x.UserName).ToList()
                        };

                        return ApiResult<UpdateGroupAvatarResponse>.Ok(result, "Update group image successfully!");
                    }
                }
                catch (Exception e)
                {
                    return ApiResult<UpdateGroupAvatarResponse>.BadRequest(null, e.Message);
                }
            }

            return ApiResult<UpdateGroupAvatarResponse>.BadRequest(null, "Cannot update image. Something went wrong!");
        }

        public async Task<ApiResult<SendMessageResponse>> AddImageAsync(int chatId, SendImageRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return ApiResult<SendMessageResponse>.BadRequest(null, "Not found chat with Id: " + chatId);
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<SendMessageResponse>.ForBid(null, "You do not have permission to access this chat");
            }

            if (request.Image == null)
            {
                return ApiResult<SendMessageResponse>.BadRequest(null, "Image cannot be null");
            }

            var sender = _currentUser;

            if (request.Image != null)
            {
                try
                {
                    var fileName = await _storageService.SaveImageAsync(request.Image);

                    if (!string.IsNullOrWhiteSpace(fileName))
                    {
                        var newMessage = new Message()
                        {
                            Sender = sender,
                            Chat = chat,
                            ImageFileName = fileName,
                            DateCreated = DateTime.Now,
                        };

                        await _context.Messages.AddAsync(newMessage);

                        await _context.SaveChangesAsync();

                        var result = new SendMessageResponse()
                        {
                            ChatId = chat.Id,
                            Message = _mapper.Map<MessageViewModel>(newMessage),
                            RecipientUserNames = chat.Participants.Select(x => x.UserName).ToList()
                        };

                        return ApiResult<SendMessageResponse>.Created(result, "Send image successfully");
                    }
                }
                catch (Exception e)
                {
                    return ApiResult<SendMessageResponse>.BadRequest(null, e.Message);
                }
            }

            return ApiResult<SendMessageResponse>.BadRequest(null, "Cannot update image. Something went wrong!");
        }

        public async Task<ApiResult<ReadChatResponse>> ReadChatAsync(int chatId)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages.Where(x => !x.ReadByUsers.Contains(_currentUser)))
                .ThenInclude(x => x.ReadByUsers)
                .AsSplitQuery()
                .OrderBy(x => x.DateCreated)
                .FirstOrDefaultAsync(x => x.Id == chatId);

            if (chat == null)
            {
                return ApiResult<ReadChatResponse>.NotFound(null, "Not found chat with id: " + chatId);
            }

            var isHaveAccess = IsHavePermissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return ApiResult<ReadChatResponse>.ForBid(null, "You do not have permission to access this chat");
            }

            chat.Messages.ForEach(x => x.ReadByUsers.Add(_currentUser));

            await _context.SaveChangesAsync();

            var result = new ReadChatResponse()
            {
                ChatId = chat.Id,
                ReadByUserName = _currentUser.UserName,
                RecipientUserNames = chat.Participants.Select(x => x.UserName).ToList()
            };

            return ApiResult<ReadChatResponse>.Ok(result, $"Read chat {chatId} successfully!");
        }
    }
}