using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TeeChat.Models.Common.Enums;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreatePrivateChatRequest
    { 

        [Required(ErrorMessage = "Participant username cannot be null")]
        public string ParticipantUserName { get; set; }
    }
}