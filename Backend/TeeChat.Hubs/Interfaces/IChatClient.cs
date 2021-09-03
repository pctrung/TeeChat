using System.Threading.Tasks;
using TeeChat.Models.ResponseModels.Chats;
using TeeChat.Models.ResponseModels.Messages;

namespace TeeChat.Hubs.Interfaces
{
    public interface IChatClient
    {
        Task ReceiveMessage(SendMessageResponse message);

        Task ReceiveChat(CreateChatResponse chat);
    }
}