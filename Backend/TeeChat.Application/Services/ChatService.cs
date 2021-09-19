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
        private readonly IStorageService _storageService;
        private const int DEFAULT_LIMIT = 30;

        public ChatService(IMapper mapper, TeeChatDbContext context, ICurrentUser currentUser, IStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<ApiResult<SendMessageResponse>> AddMessageAsync(int chatId, SendMessageRequest request)
        {
            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);
            if (chat == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with Id: " + chatId
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
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

            var sender = await _context.Users.FindAsync(_currentUser.UserId);
            if (sender == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

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
                ParticipantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList()
            };

            return new ApiResult<SendMessageResponse>(result)
            {
                StatusCode = 201,
                Message = "Send message successfully"
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
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Please enter group name"
                };
            }

            // add participants
            var participants = await _context.Users
                .Where(x => !x.UserName
                .Equals(_currentUser.UserName) && request.ParticipantUserNames.Contains(x.UserName))
                .ToListAsync();

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

            var chat = new Chat
            {
                Type = ChatType.Group,
                Participants = participants
            };
            chat.Participants.Add(currentUser);
            chat.Creator = currentUser;
            chat.DateCreated = DateTime.Now;
            chat.Name = request.Name.Trim();

            await _context.Chats.AddAsync(chat);

            await _context.SaveChangesAsync();

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    ParticipantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList()
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
            var participant = await _context.Users.FirstOrDefaultAsync(x => request.ParticipantUserName.Equals(x.UserName));

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

            var chat = await _context.Chats.FirstOrDefaultAsync(x => x.Type == ChatType.Private && x.Participants.Contains(currentUser) && x.Participants.Contains(participant));

            bool isExistChat = chat != null;

            if (!isExistChat)
            {
                chat = new Chat();
                chat.Type = ChatType.Private;
                chat.Participants = new List<AppUser>() { participant };
                chat.Participants.Add(currentUser);
                chat.Creator = currentUser;
                chat.DateCreated = DateTime.Now;
                await _context.Chats.AddAsync(chat);
                await _context.SaveChangesAsync();
            }

            if (chat.Id != 0)
            {
                var result = new CreateChatResponse()
                {
                    Chat = _mapper.Map<ChatViewModel>(chat),
                    ParticipantUserNamesToNotify = isExistChat ? new List<string> { currentUser.UserName } : chat.Participants.Select(x => x.UserName).ToList()
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
                    Message = "Cannot create chat. Something went wrong!"
                };
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
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + chatId
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
            }

            var currentUser = await _context.Users.FindAsync(_currentUser.UserId);
            if (currentUser == null)
            {
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            chat.Messages = chat.Messages.AsQueryable().Where(x => !string.IsNullOrEmpty(x.Content) ? x.Content.Contains(request.Keyword ?? "") : true).ToList();

            var numOfUnreadMessages = chat.Messages.Where(x => !x.ReadByUsers.Contains(currentUser)).Count();

            var totalMessage = chat.Messages.Count();
            var pageCount = (double)totalMessage / DEFAULT_LIMIT;
            var totalPage = (int)Math.Ceiling(pageCount);

            request.Page = request.Page > 0 ? request.Page : 1;
            request.Page = request.Page <= totalPage ? request.Page : totalPage;
            chat.Messages = chat.Messages.AsQueryable().OrderByDescending(x => x.DateCreated).Paged(request.Page, DEFAULT_LIMIT).ToList();

            var lastMessage = chat.Messages.LastOrDefault();
            var readByUserNames = lastMessage != null ? lastMessage.ReadByUsers.Select(x => x.UserName).ToList() : null;

            if (chat == null)
            {
                return new ApiResult<ChatViewModel>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + chatId
                };
            }
            else
            {
                var result = _mapper.Map<ChatViewModel>(chat);
                result.Keyword = request.Keyword;
                result.Page = request.Page;
                result.Limit = DEFAULT_LIMIT;
                result.TotalRecords = totalMessage;
                result.NumOfUnreadMessages = numOfUnreadMessages;
                result.ReadByUserNames = readByUserNames;

                return new ApiResult<ChatViewModel>(result)
                {
                    StatusCode = 200,
                    Message = "Get chat successfully, id: " + chatId
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

            var currentUser = await _context.Users.FindAsync(_currentUser.UserId);
            if (currentUser == null)
            {
                return new ApiResult<List<ChatViewModel>>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            var query = _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages)
                .ThenInclude(x => x.ReadByUsers)
                .OrderBy(x => x.DateCreated)
                .AsSplitQuery();

            var chats = await query.Where(x => x.Participants.Contains(user)).ToListAsync();

            var numOfUnreadMessagesByChatId = new Dictionary<int, int>();
            var readByUserNamesByChatId = new Dictionary<int, List<string>>();

            chats.ForEach(x =>
            {
                var numOfUnreadMessages = x.Messages.Where(x => !x.ReadByUsers.Contains(currentUser)).Count();
                numOfUnreadMessagesByChatId.Add(x.Id, numOfUnreadMessages);

                var lastMessage = x.Messages.LastOrDefault();
                readByUserNamesByChatId.Add(x.Id, lastMessage != null ? lastMessage.ReadByUsers.Select(x => x.UserName).ToList() : null);
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
                x.TotalRecords = x.Messages.Count();
                x.Messages = x.Messages.AsQueryable().OrderByDescending(x => x.DateCreated).Paged(1, DEFAULT_LIMIT).ToList();
                x.NumOfUnreadMessages = numOfUnreadMessagesByChatId[x.Id];
                x.ReadByUserNames = readByUserNamesByChatId[x.Id];
            });

            var result = new ApiResult<List<ChatViewModel>>(chatViewModel)
            {
                StatusCode = 200,
                Message = "Get chat successfully"
            };

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
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + chatId
                };
            }
            if (chat.Type == ChatType.Private)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 400,
                    Message = "You can only update group chat"
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return new ApiResult<CreateChatResponse>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
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
                        return new ApiResult<CreateChatResponse>(null)
                        {
                            StatusCode = 404,
                            Message = "Not found user: " + userName
                        };
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
                        return new ApiResult<CreateChatResponse>(null)
                        {
                            StatusCode = 404,
                            Message = "Not found user: " + userName
                        };
                    }
                    chat.Participants.Remove(user);
                }
            }

            await _context.SaveChangesAsync();

            var result = new CreateChatResponse()
            {
                Chat = _mapper.Map<ChatViewModel>(chat),
                ParticipantUserNamesToNotify = participantUserNamesToNotify
            };

            return new ApiResult<CreateChatResponse>(result)
            {
                StatusCode = 200,
                Message = "Update chat successfully"
            };
        }

        private async Task<bool> IsHavePerrmissionToAccessChatAsync(Chat chat)
        {
            var user = await _context.Users.FindAsync(_currentUser.UserId);

            if (user == null)
            {
                return false;
            }

            var result = chat.Participants.Contains(user);

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
                return new ApiResult<UpdateGroupAvatarResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + chatId
                };
            }
            if (chat.Type == ChatType.Private)
            {
                return new ApiResult<UpdateGroupAvatarResponse>(null)
                {
                    StatusCode = 400,
                    Message = "You can only update group chat"
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return new ApiResult<UpdateGroupAvatarResponse>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
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
                            ParticipantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList()
                        };

                        return new ApiResult<UpdateGroupAvatarResponse>(result)
                        {
                            StatusCode = 200,
                            Message = "Update group image successfully!"
                        };
                    }
                }
                catch (Exception e)
                {
                    return new ApiResult<UpdateGroupAvatarResponse>(null)
                    {
                        StatusCode = 400,
                        Message = e.Message
                    };
                }
            }

            return new ApiResult<UpdateGroupAvatarResponse>(null)
            {
                StatusCode = 400,
                Message = "Cannot update image. Something went wrong!"
            };
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
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with Id: " + chatId
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
            }

            if (request.Image == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 400,
                    Message = "Image cannot be null"
                };
            }

            var sender = await _context.Users.FindAsync(_currentUser.UserId);

            if (sender == null)
            {
                return new ApiResult<SendMessageResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

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
                            ParticipantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList()
                        };

                        return new ApiResult<SendMessageResponse>(result)
                        {
                            StatusCode = 201,
                            Message = "Send image successfully"
                        };
                    }
                }
                catch (Exception e)
                {
                    return new ApiResult<SendMessageResponse>(null)
                    {
                        StatusCode = 400,
                        Message = e.Message
                    };
                }
            }

            return new ApiResult<SendMessageResponse>(null)
            {
                StatusCode = 400,
                Message = "Cannot update image. Something went wrong!"
            };
        }

        public async Task<ApiResult<ReadChatResponse>> ReadChatAsync(int chatId)
        {
            var currentUser = await _context.Users.FindAsync(_currentUser.UserId);

            if (currentUser == null)
            {
                return new ApiResult<ReadChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Something went wrong with current user"
                };
            }

            var chat = await _context.Chats
                .Include(x => x.Participants)
                .Include(x => x.Messages.Where(x => !x.ReadByUsers.Contains(currentUser)))
                .ThenInclude(x => x.ReadByUsers)
                .AsSplitQuery()
                .FirstOrDefaultAsync(x => x.Id == chatId);

            if (chat == null)
            {
                return new ApiResult<ReadChatResponse>(null)
                {
                    StatusCode = 404,
                    Message = "Not found chat with id: " + chatId
                };
            }

            var isHaveAccess = await IsHavePerrmissionToAccessChatAsync(chat);
            if (!isHaveAccess)
            {
                return new ApiResult<ReadChatResponse>(null)
                {
                    StatusCode = 403,
                    Message = "You do not have permission to access this chat"
                };
            }

            chat.Messages.ForEach(x => x.ReadByUsers.Add(currentUser));

            await _context.SaveChangesAsync();

            var result = new ReadChatResponse()
            {
                ChatId = chat.Id,
                ReadByUserName = currentUser.UserName,
                ParticipantUserNamesToNotify = chat.Participants.Select(x => x.UserName).ToList()
            };

            return new ApiResult<ReadChatResponse>(result)
            {
                StatusCode = 200,
                Message = $"Read chat {chatId} successfully!"
            };
        }
    }
}