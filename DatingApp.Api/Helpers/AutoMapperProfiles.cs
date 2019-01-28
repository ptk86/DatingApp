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
        }
    }
}
