using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Messages
{
    public class SendMessageRequest
    {
        [Required(ErrorMessage = "Content cannot be null or empty")]
        public string Content { get; set; }
    }
}