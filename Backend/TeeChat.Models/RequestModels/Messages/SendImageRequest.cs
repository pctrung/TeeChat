using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Messages
{
    public class SendImageRequest
    {
        [Required(ErrorMessage = "Image cannot be null")]
        public IFormFile Image { get; set; }
    }
}