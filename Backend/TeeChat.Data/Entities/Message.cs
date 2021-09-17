using System;
using System.Collections.Generic;

namespace TeeChat.Data.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public string ImageFileName { get; set; }
        public AppUser Sender { get; set; }
        public Chat Chat { get; set; }
        public DateTime DateCreated { get; set; }
        public List<AppUser> ReadByUsers { get; set; }
    }
}