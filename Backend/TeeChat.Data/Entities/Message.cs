using System.Collections.Generic;

namespace TeeChat.Data.Entities
{
    public class Message : BaseEntity
    {
        public string Content { get; set; }
        public string ImageFileName { get; set; }
        public AppUser Sender { get; set; }
        public Chat Chat { get; set; }
        public List<AppUser> ReadByUsers { get; set; }
    }
}