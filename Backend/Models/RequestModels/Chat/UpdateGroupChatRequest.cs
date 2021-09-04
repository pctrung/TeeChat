using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeeChat.Models.RequestModels.Chat
{
    public class UpdateGroupChatRequest
    {
        public string NewGroupName { get; set; }
        public List<string> ParticipantUserNamesToAdd { get; set; }
        public List<string> ParticipantUserNamesToRemove { get; set; }
    }
}