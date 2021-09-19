using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TeeChat.Application.Interfaces;
using TeeChat.Models.RequestModels.Users;

namespace TeeChat.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{userName}/isExists")]
        public async Task<IActionResult> CheckUserExistsAsync(string userName)
        {
            var result = await _userService.CheckUserNameExistsAsync(userName);

            return Ok(new { isExists = result });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var result = await _userService.RegisterAsync(request);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            else
            {
                var message = "";
                foreach (var error in result.Errors)
                {
                    message = error.Description;
                    break;
                }
                return BadRequest(message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var result = await _userService.LoginAsync(request);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest("Username or password is incorrect");
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetFriendListAsync()
        {
            var result = await _userService.GetFriendListAsync();

            return Ok(result);
        }

        [HttpGet("current")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUserAsync()
        {
            var result = await _userService.GetCurrentUserAsync();

            return result.StatusCode switch
            {
                200 => Ok(result.Data),
                _ => BadRequest(result.Message),
            };
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateUserAsync([FromForm] UpdateUserRequest request)
        {
            var result = await _userService.UpdateUserAsync(request);

            return result.StatusCode switch
            {
                200 => Ok(result.Data),
                _ => BadRequest(result.Message),
            };
        }
    }
}