using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TeeChat.Application.Interfaces;
using TeeChat.Data.EF;
using TeeChat.Data.Entities;
using TeeChat.Models.RequestModels.Users;
using TeeChat.Models.ViewModels;

namespace TeeChat.Application.Services
{
    public class UserService : IUserService
    {
        private readonly TeeChatDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public UserService(TeeChatDbContext context, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<bool> CheckUserNameExistsAsync(string userName)
        {
            if (!string.IsNullOrEmpty(userName))
            {
                return await _context.Users.AnyAsync(x => x.UserName.Equals(userName));
            }
            return false;
        }

        public async Task<string> LoginAsync(LoginRequest request)
        {
            var username = request.Username;

            // check email is match if user type email
            var emailCheck = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Username);
            if (emailCheck != null)
            {
                username = emailCheck.UserName;
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return null;
            }

            var result = await _signInManager.PasswordSignInAsync(user.UserName, request.Password, request.RememberMe, false);

            if (!result.Succeeded)
            {
                return null;
            }

            var claims = await _userManager.GetClaimsAsync(user);

            string issuer = _configuration["Tokens:Issuer"];
            string signingKey = _configuration["Tokens:Key"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(issuer,
                issuer,
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<List<UserViewModel>> GetFriendListAsync()
        {
            // filter friend in social app
            var data = await _context.Users.ToListAsync();

            var result = _mapper.Map<List<UserViewModel>>(data);

            return result;
        }

        public async Task<IdentityResult> RegisterAsync(RegisterRequest request)
        {
            if (string.Compare(request.Password, request.ConfirmPassword) != 0)
            {
                return IdentityResult.Failed(
                    new IdentityError()
                    {
                        Description = "Password and confirm password must be same",
                        Code = "400"
                    });
            }

            var user = new AppUser()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Username,
                CreatedDate = DateTime.Now,
                Email = request.Email
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            await _userManager.AddClaimAsync(user, new Claim("id", user.Id));
            await _userManager.AddClaimAsync(user, new Claim("userName", user.UserName));
            await _userManager.AddClaimAsync(user, new Claim("firstName", user.LastName));
            await _userManager.AddClaimAsync(user, new Claim("lastName", user.FirstName));
            await _userManager.AddClaimAsync(user, new Claim("email", user.Email));
            await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.NameIdentifier, user.UserName));
            await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Name, user.UserName));
            await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Email, user.Email));
            return result;
        }
    }
}