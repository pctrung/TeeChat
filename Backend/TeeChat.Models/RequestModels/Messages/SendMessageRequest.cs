using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Messages
{
    public class SendMessageRequest
    {
        [Required(ErrorMessage = "Please enter message content!")]
        public string Content { get; set; }
    }
}