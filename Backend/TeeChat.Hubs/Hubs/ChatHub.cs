using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using TeeChat.Hubs.Interfaces;
using TeeChat.Models.ResponseModels.Chats;
using TeeChat.Models.ResponseModels.Messages;
using TeeChat.Models.ViewModels;

namespace TeeChat.Hubs.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessageAsync(SendMessageResponse response)
        {
            await Clients.All.ReceiveMessage(response);
        }

        public async Task CreateChatAsync(CreateChatResponse response)
        {
            await Clients.All.ReceiveChat(response);
        }
    }
}