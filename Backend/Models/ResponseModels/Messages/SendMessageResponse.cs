using System.Collections.Generic;
using TeeChat.Models.ViewModels;

namespace TeeChat.Models.ResponseModels.Messages
{
    public class SendMessageResponse
    {
        public int ChatId { get; set; }
        public List<string> ParticipantUserNames { get; set; }
        public MessageViewModel Message { get; set; }
    }
}