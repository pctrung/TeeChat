using Microsoft.AspNetCore.Http;

namespace TeeChat.Models.RequestModels.Users
{
    public class UpdateUserRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile Avatar { get; set; }
    }
}