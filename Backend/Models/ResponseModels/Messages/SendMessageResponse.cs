using System.Collections.Generic;
using TeeChat.Models.ResponseModels.Interfaces;
using TeeChat.Models.ViewModels;

namespace TeeChat.Models.ResponseModels.Messages
{
    public class SendMessageResponse : HubResponseBase
    {
        public int ChatId { get; set; }
        public MessageViewModel Message { get; set; }
    }
}