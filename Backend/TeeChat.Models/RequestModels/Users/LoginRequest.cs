using System.ComponentModel.DataAnnotations;

namespace TeeChat.Models.RequestModels.Users
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Please enter username or email")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Please enter password")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}