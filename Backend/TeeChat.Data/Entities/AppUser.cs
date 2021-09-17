using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace TeeChat.Data.Entities
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarFileName { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<Chat> Chats { get; set; }
        public List<Message> Messages { get; set; }
        public List<Message> ReadMessages { get; set; }
    }
}