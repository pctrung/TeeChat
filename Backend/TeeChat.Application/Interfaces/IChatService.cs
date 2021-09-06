using System.Collections.Generic;
using System.Threading.Tasks;
using TeeChat.Models.Common;
using TeeChat.Models.RequestModels.Chat;
using TeeChat.Models.RequestModels.Messages;
using TeeChat.Models.ResponseModels.Chats;
using TeeChat.Models.ResponseModels.Messages;
using TeeChat.Models.ViewModels;

namespace TeeChat.Application.Interfaces
{
    public interface IChatService
    {
        Task<ApiResult<SendMessageResponse>> AddMessageAsync(int chatId, SendMessageRequest request);

        Task<ApiResult<CreateChatResponse>> CreateGroupChatAsync(CreateGroupChatRequest request);

        Task<ApiResult<CreateChatResponse>> UpdateGroupChatAsync(int chatId, UpdateGroupChatRequest request);

        Task<ApiResult<UpdateGroupAvatarResponse>> UpdateGroupAvatarAsync(int chatId, UpdateGroupAvatarRequest request);

        Task<ApiResult<CreateChatResponse>> CreatePrivateChatAsync(CreatePrivateChatRequest request);

        Task<ApiResult<List<ChatViewModel>>> GetAllAsync();

        Task<ApiResult<ChatViewModel>> GetByIdAsync(int id, GetChatRequest request);
    }
}