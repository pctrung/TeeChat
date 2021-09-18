using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TeeChat.Hubs.Interfaces;

namespace TeeChat.Hubs.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
    }
}