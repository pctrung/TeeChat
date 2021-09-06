using TeeChat.Models.ResponseModels.Interfaces;
using TeeChat.Models.ViewModels;

namespace TeeChat.Models.ResponseModels.Chats
{
    public class CreateChatResponse : HubResponseBase
    {
        public ChatViewModel Chat { get; set; }
    }
}