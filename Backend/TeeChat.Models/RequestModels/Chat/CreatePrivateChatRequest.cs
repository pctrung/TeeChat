using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreatePrivateChatRequest
    {
        [Required(ErrorMessage = "Please select a member to start!")]
        public string ParticipantUserName { get; set; }
    }
}