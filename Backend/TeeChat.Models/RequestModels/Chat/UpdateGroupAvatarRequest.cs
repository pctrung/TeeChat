using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class UpdateGroupAvatarRequest
    {
        [Required(ErrorMessage = "Please upload avatar file")]
        public IFormFile Avatar { get; set; }
    }
}