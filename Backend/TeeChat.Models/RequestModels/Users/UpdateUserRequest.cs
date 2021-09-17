using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Users
{
    public class UpdateUserRequest
    {
        [MaxLength(50, ErrorMessage = "Maximum character for first name is {1} character")]
        public string FirstName { get; set; }

        [MaxLength(50, ErrorMessage = "Maximum character for last name is {1} character")]
        public string LastName { get; set; }

        public IFormFile Avatar { get; set; }
    }
}