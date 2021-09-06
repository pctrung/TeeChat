using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeeChat.Models.Common;
using TeeChat.Models.RequestModels.Users;
using TeeChat.Models.ViewModels;

namespace TeeChat.Application.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> RegisterAsync(RegisterRequest request);

        Task<List<UserViewModel>> GetFriendListAsync();

        Task<string> LoginAsync(LoginRequest request);

        Task LogoutAsync();

        Task<bool> CheckUserNameExistsAsync(string userName);

        Task<ApiResult<UserViewModel>> UpdateUserAsync(UpdateUserRequest request);
    }
}