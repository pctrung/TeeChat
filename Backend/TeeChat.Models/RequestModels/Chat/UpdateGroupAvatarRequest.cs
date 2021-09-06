using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class UpdateGroupAvatarRequest
    {
        [Required(ErrorMessage = "Avatar file cannot be null")]
        public IFormFile Avatar { get; set; }
    }
}