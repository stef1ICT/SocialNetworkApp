using System.Linq;
using AutoMapper;
using socialnetwork.Dtos;
using socialnetwork.Models;

namespace socialnetwork.Helpers
{
    public class AutoMapperConfiguration : Profile
    {
        public AutoMapperConfiguration()
        {
            CreateMap<User, UserForDetailedDto>()
            .ForMember(dest => dest.PhotoUrl, opt => {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            }).ForMember(dest => dest.Age, opt => {
                 opt.ResolveUsing(d => d.DateOfBirth.calculateAge());
             });
            CreateMap<Photo, PhotoForDetails>();
             CreateMap<User, UserForList>().ForMember(dest => dest.Age, opt => {
                 opt.ResolveUsing(d => d.DateOfBirth.calculateAge());
             }).ForMember(dest => dest.PhotoUrl, opt => {
                 opt.MapFrom(src => src.Photos.FirstOrDefault(u => u.IsMain).Url);
             }); 

             CreateMap<UserForUpdateDto, User>();
             CreateMap<Photo,PhotoForReturnDto>();
             CreateMap<PhotoForCreationDto, Photo>();
               CreateMap<UserForRegisterDto, User>();
        }
    }
}