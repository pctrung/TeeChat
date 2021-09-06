﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreateGroupChatRequest
    {
        [Required(ErrorMessage = "Participant username list cannot be null")]
        public List<string> ParticipantUserNames { get; set; }

        [Required(ErrorMessage = "Group name cannot be null")]
        public string Name { get; set; }
    }
}