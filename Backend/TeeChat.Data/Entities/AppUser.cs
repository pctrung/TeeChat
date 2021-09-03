using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace TeeChat.Data.Entities
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreatedDate { get; set; }
        public virtual List<Chat> Chats { get; set; }
        public virtual List<Message> Messages { get; set; }
    }
}