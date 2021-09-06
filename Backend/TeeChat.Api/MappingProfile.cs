using AutoMapper;
using Microsoft.AspNetCore.Http;
using TeeChat.Data.Entities;
using TeeChat.Models.ViewModels;
using TeeChat.Utilities.Constants;

namespace TeeChat.Api
{
    public class MappingProfile : Profile
    {
        public MappingProfile(IHttpContextAccessor httpContextAccessor)
        {
            var hostUrl = httpContextAccessor.HttpContext.Request.Host.Value;

            if (!string.IsNullOrWhiteSpace(hostUrl))
            {
                CreateMap<AppUser, UserViewModel>()
                    .ForMember(des => des.AvatarUrl,
                    act => act.MapFrom(src => (string.IsNullOrWhiteSpace(src.AvatarFileName) ? "" : $"https://{hostUrl}/{SystemConstants.IMAGE_FOLDER}/{src.AvatarFileName}")));

                CreateMap<Chat, ChatViewModel>().ForMember(des => des.GroupAvatarUrl,
                    act => act.MapFrom(src => (string.IsNullOrWhiteSpace(src.AvatarFileName) ? "" : $"https://{hostUrl}/{SystemConstants.IMAGE_FOLDER}/{src.AvatarFileName}")));

                CreateMap<Message, MessageViewModel>()
                .ForMember(des => des.SenderUserName, act => act.MapFrom(src => src.Sender.UserName))
                .ForMember(des => des.SenderFullName, act => act.MapFrom(src => $"{src.Sender.LastName} {src.Sender.FirstName}"))
                .ForMember(des => des.ImageUrl,
                    act => act.MapFrom(src => (string.IsNullOrWhiteSpace(src.ImageFileName) ? "" : $"https://{hostUrl}/{SystemConstants.IMAGE_FOLDER}/{src.ImageFileName}")));
            }
            else
            {
                CreateMap<AppUser, UserViewModel>();
                CreateMap<Chat, ChatViewModel>();
                CreateMap<Message, MessageViewModel>()
                    .ForMember(des => des.SenderUserName, act => act.MapFrom(src => src.Sender.UserName))
                    .ForMember(des => des.SenderFullName, act => act.MapFrom(src => $"{src.Sender.LastName} {src.Sender.FirstName}"));
            }
        }
    }
}