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
        public string AvatarFileName { get; set; }
        public ChatType Type { get; set; }
        public List<AppUser> Participants { get; set; }
        public List<Message> Messages { get; set; }
        public DateTime DateCreated { get; set; }
    }
}