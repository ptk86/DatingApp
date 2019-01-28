using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using DatingApp.Api.Helpers;
using DatingApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DatingApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/[controller]")]
    public class PhotosController : Controller
    {
        private readonly DataContext _dataContext;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        public PhotosController(DataContext dataContext, IOptions<CloudinarySettings> cloudinarySettings, IMapper mapper)
        {
            _dataContext = dataContext;
            _cloudinarySettings = cloudinarySettings;
            _mapper = mapper;

            var account = new Account
            {
                Cloud = cloudinarySettings.Value.CloudName,
                ApiKey = cloudinarySettings.Value.ApiKey,
                ApiSecret = cloudinarySettings.Value.ApiSecret
            };

            _cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var photo = await _dataContext.Photos.FirstOrDefaultAsync(p => p.Id == id);
            var dto = _mapper.Map<PhotoForUserDetail>(photo);

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int userId, int id)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var user = await _dataContext.Users.Include(u => u.Photos)
                           .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return BadRequest("User does not exist in the database!");
            }

            if (user.Photos.All(p => p.Id != id))
            {
                return Unauthorized();
            }
            
            var photoToRemove = user.Photos.First(p => p.Id == id);

            if (photoToRemove.IsMain)
            {
                return BadRequest("You cannot remove your main photo!");
            }

            if (photoToRemove.PublicId != null)
            {
                var deletionParams = new DeletionParams(photoToRemove.PublicId);
                var result = _cloudinary.Destroy(deletionParams);

                if (result.Result == "ok")
                {
                    user.Photos.Remove(photoToRemove);
                }
            }
            else
            {
                user.Photos.Remove(photoToRemove);
            }


            await _dataContext.SaveChangesAsync();
            return NoContent();
        }


        [HttpPost]
        [Route("{id}/SetMain")]
        public async Task<IActionResult> SetMain(int userId, int id)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var user = await _dataContext.Users.Include(u => u.Photos)
                           .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return BadRequest("User does not exist in the database!");
            }

            if (user.Photos.All(p => p.Id != id))
            {
                return Unauthorized();
            }

            if (user.Photos.Any(p => p.IsMain && p.Id == id))
            {
                return NoContent();
            }

            user.Photos.
                Where(p => p.Id == id || p.IsMain)
                .ToList()
                .ForEach(p => p.IsMain = !p.IsMain);

            await _dataContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> Post(int userId, [FromForm]PhotoCreate dto)
        {
            var tokenId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (userId != int.Parse(tokenId))
            {
                return Unauthorized();
            }

            var user = await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == userId);
            var file = dto.File;
            var imageUploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    imageUploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            var photo = _mapper.Map<Photo>(dto);
            photo.PublicId = imageUploadResult.PublicId;
            photo.Url = imageUploadResult.Uri.ToString();

            user.Photos.Add(photo);
            await _dataContext.SaveChangesAsync();

            var photoToReturn = _mapper.Map<PhotoForUserDetail>(photo);
            return CreatedAtRoute("", new {id = photo.Id}, photoToReturn);
        }
    }
}