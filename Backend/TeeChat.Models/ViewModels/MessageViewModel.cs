using System;

namespace TeeChat.Models.ViewModels
{
    public class MessageViewModel
    {
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public string SenderUserName { get; set; }
        public string SenderFullName { get; set; }
        public DateTime DateCreated { get; set; }
    }
}