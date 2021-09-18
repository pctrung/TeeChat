using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeeChat.Hubs.Interfaces;

namespace TeeChat.Hubs.Hubs
{
    [Authorize]
    public class ChatHub : Hub<IChatClient>
    {
        private static List<string> _onlineUserNameList = new List<string>();

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            if (!_onlineUserNameList.Contains(Context.UserIdentifier))
            {
                _onlineUserNameList.Add(Context.UserIdentifier);
                await Clients.All.ReceiveUpdatedOnlineUserNameList(_onlineUserNameList);
            }
        }

        public override async Task OnDisconnectedAsync(Exception e)
        {
            await base.OnDisconnectedAsync(e);

            if (_onlineUserNameList.Contains(Context.UserIdentifier))
            {
                _onlineUserNameList.Remove(Context.UserIdentifier);
                await Clients.All.ReceiveUpdatedOnlineUserNameList(_onlineUserNameList);
            }
        }
    }
}