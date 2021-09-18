using System.Threading.Tasks;
using TeeChat.Models.ResponseModels.Chats;
using TeeChat.Models.ResponseModels.Messages;
using TeeChat.Models.ViewModels;

namespace TeeChat.Hubs.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(SendMessageResponse message);

        Task ReceiveChat(ChatViewModel chat);

        Task ReceiveUpdatedChat(ChatViewModel chat);

        Task ReceiveUpdatedGroupAvatar(UpdateGroupAvatarResponse response);

        Task ReceiveAddReadByUserName(ReadChatResponse response);
    }
}