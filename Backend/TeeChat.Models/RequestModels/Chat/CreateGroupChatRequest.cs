﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreateGroupChatRequest
    {
        [Required(ErrorMessage = "Please selecter participants!")]
        public List<string> ParticipantUserNames { get; set; }

        [Required(ErrorMessage = "Please enter group name!")]
        [MaxLength(100, ErrorMessage = "Maximum character for group name is {1} character")]
        public string Name { get; set; }
    }
}