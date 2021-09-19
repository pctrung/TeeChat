using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace TeeChat.Data.Entities
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get => $"{LastName} {FirstName}"; }
        public string AvatarFileName { get; set; }
        public DateTime DateCreated { get; set; }
        public List<Chat> CreatedChats { get; set; }
        public List<Chat> JoinedChats { get; set; }
        public List<Message> SentMessages { get; set; }
        public List<Message> ReadMessages { get; set; }
    }
}