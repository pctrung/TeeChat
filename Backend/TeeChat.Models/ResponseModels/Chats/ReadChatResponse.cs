using System;
using TeeChat.Models.ResponseModels.Interfaces;

namespace TeeChat.Models.ResponseModels.Chats
{
    public class ReadChatResponse : HubResponseBase
    {
        public int ChatId { get; set; }
        public string ReadByUserName { get; set; } 
    }
}