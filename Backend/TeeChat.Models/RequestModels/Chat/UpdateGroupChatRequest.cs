using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class UpdateGroupChatRequest
    {
        [MaxLength(100, ErrorMessage = "Maximum character for group name is {1} character")]
        public string NewGroupName { get; set; }

        public List<string> ParticipantUserNamesToAdd { get; set; }
        public List<string> ParticipantUserNamesToRemove { get; set; }
    }
}