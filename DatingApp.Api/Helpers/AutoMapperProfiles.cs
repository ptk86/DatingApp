using System.Linq;
using AutoMapper;
using DatingApp.Api.Dto;
using DatingApp.Api.Models;

namespace DatingApp.Api.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserListItem>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                    {
                        opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                    })
                .ForMember(dest => dest.Age, opt =>
                    {
                        opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                    });

            CreateMap<User, UserDetail>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                    {
                        opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                    })
                .ForMember(dest => dest.Age, opt =>
                    {
                        opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                    });

            CreateMap<Photo, PhotoForUserDetail>();
            CreateMap<PhotoCreate, Photo>();
            CreateMap<UserUpdate, User>();
            CreateMap<UserCreate, User>();
            CreateMap<MessageCreate, Models.Message>().ReverseMap();
            CreateMap<Models.Message, Dto.Message>()
                .ForMember(dest => dest.SenderPhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.RecipientPhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);
                });
        }
    }
}
