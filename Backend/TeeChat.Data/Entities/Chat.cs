using System;
using System.Collections.Generic;
using TeeChat.Models.Common.Enums;

namespace TeeChat.Data.Entities
{
    public class Chat
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CreatorUserName { get; set; }
        public ChatType Type { get; set; }
        public virtual List<AppUser> Participants { get; set; }
        public virtual List<Message> Messages { get; set; }
        public DateTime DateCreated { get; set; }
    }
}