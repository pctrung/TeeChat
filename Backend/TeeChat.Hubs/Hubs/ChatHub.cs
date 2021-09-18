using Microsoft.AspNetCore.SignalR;
using TeeChat.Hubs.Interfaces;

namespace TeeChat.Hubs.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
    }
}