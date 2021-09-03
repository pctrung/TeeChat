using System;

namespace TeeChat.Data.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public virtual AppUser Sender { get; set; }
        public virtual Chat Chat { get; set; }
        public DateTime DateCreated { get; set; }
    }
}