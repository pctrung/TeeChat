using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Chat
{
    public class GetChatRequest
    {
        [Required]
        [DefaultValue(2)]
        [Range(1, int.MaxValue, ErrorMessage = "Only positive number allowed")]
        public int Page { get; set; }

        public string Keyword { get; set; }
    }
}