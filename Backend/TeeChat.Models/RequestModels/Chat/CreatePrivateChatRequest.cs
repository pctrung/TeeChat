using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class CreatePrivateChatRequest
    {
        [Required(ErrorMessage = "Participant username cannot be null")]
        public string ParticipantUserName { get; set; }
    }
}