using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace TeeChat.Application.Identity
{
    public class CurrentUser : ICurrentUser
    {
        public string UserName { get => _httpContextAccessor.HttpContext.User.FindFirstValue("UserName"); }
        public string UserId { get => _httpContextAccessor.HttpContext.User.FindFirstValue("Id"); }
        public string Email { get => _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email); }
        public string FirstName { get => _httpContextAccessor.HttpContext.User.FindFirstValue("FirstName"); }
        public string LastName { get => _httpContextAccessor.HttpContext.User.FindFirstValue("LastName"); }
        public string FullName { get => LastName + " " + FirstName; }
        public ClaimsPrincipal User { get => _httpContextAccessor.HttpContext.User; }

        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
    }
}