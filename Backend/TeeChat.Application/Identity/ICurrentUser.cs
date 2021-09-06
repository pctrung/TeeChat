using System.Security.Claims;

namespace TeeChat.Application.Identity
{
    public interface ICurrentUser
    {
        string UserName { get; }

        string UserId { get; }

        string Email { get; }

        string FirstName { get; }

        string LastName { get; }
        
        string FullName { get; }
        
        ClaimsPrincipal User { get; }
    }
}