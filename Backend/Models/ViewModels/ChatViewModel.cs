using System;
using System.Collections.Generic;
using TeeChat.Models.Common.Enums;

namespace TeeChat.Models.ViewModels
{
    public class ChatViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChatType Type { get; set; }
        public string CreatorUserName { get; set; }
        public virtual List<UserViewModel> Participants { get; set; }
        public virtual List<MessageViewModel> Messages { get; set; }
        public DateTime DateCreated { get; set; }
    }
}