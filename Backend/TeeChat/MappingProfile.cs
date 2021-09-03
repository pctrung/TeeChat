using AutoMapper;
using TeeChat.Data.Entities;
using TeeChat.Models.ViewModels;

namespace TeeChat
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserViewModel>();
            CreateMap<Chat, ChatViewModel>();
            CreateMap<Message, MessageViewModel>()
                .ForMember(des => des.SenderUserName, act => act.MapFrom(src => src.Sender.UserName))
                .ForMember(des => des.SenderFullName, act => act.MapFrom(src => $"{src.Sender.LastName} {src.Sender.FirstName}"));
        }
    }
}