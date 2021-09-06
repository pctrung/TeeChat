using System.Collections.Generic;

namespace TeeChat.Models.RequestModels.Chat
{
    public class UpdateGroupChatRequest
    {
        public string NewGroupName { get; set; }
        public List<string> ParticipantUserNamesToAdd { get; set; }
        public List<string> ParticipantUserNamesToRemove { get; set; }
    }
}