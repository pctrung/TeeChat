using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using TeeChat.Models.RequestModels.Users;

namespace TeeChat.Application.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> RegisterAsync(RegisterRequest request);

        Task<string> LoginAsync(LoginRequest request);

        Task LogoutAsync();
    }
}