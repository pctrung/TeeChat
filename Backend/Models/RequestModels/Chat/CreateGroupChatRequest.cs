using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TeeChat.Models.Common.Enums;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreateGroupChatRequest
    {
        [Required(ErrorMessage = "Content cannot be null or empty")]
        public string Content { get; set; }

        [Required(ErrorMessage = "Participant username list cannot be null")]
        public List<string> ParticipantUserNames { get; set; }

        [Required(ErrorMessage = "Group name cannot be null")]
        public string Name { get; set; }
    }
}