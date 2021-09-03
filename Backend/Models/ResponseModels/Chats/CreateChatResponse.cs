using System.Collections.Generic;
using TeeChat.Models.ViewModels;

namespace TeeChat.Models.ResponseModels.Chats
{
    public class CreateChatResponse
    {
        public List<string> ParticipantUserNames { get; set; }
        public ChatViewModel Chat { get; set; }
    }
}