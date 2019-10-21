using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using socialnetwork.Data;
using socialnetwork.Dtos;
using socialnetwork.Helpers;
using socialnetwork.Models;

namespace socialnetwork.Controllers
{
  [Authorize]
  [Route("api/users/{userId}/photos")]
  [ApiController]
  public class PhotoController : ControllerBase
  {
    private readonly IDatingRepository _repo;
    private readonly IMapper _mapper;
    private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
    private Cloudinary _cloudinary;

    public PhotoController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
    {
      _cloudinaryConfig = cloudinaryConfig;
      _mapper = mapper;
      _repo = repo;

        Account acc = new Account(
            _cloudinaryConfig.Value.CloudName,
            _cloudinaryConfig.Value.ApiKey,
            _cloudinaryConfig.Value.CloudSecret
        );
        _cloudinary = new Cloudinary(acc);
    }


[HttpGet("{id}", Name="GetPhoto")]
public async Task<IActionResult> GetPhoto(int id) {

    var photoFromRepo = await _repo.getPhoto(id);


    var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

    return Ok(photo);

}

    [HttpPost]
    public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreationDto) {
         if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
        return Unauthorized();
      }

      var userFromRepo = await _repo.getUser(userId);

      var file = photoForCreationDto.File;

      var uploadResult = new ImageUploadResult();


      if(file.Length > 0) {
          using(var stream = file.OpenReadStream()) {
              var uploadParams = new ImageUploadParams() {
                  File = new FileDescription(file.Name, stream),
                  Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
              }; 
               uploadResult = _cloudinary.Upload(uploadParams);
          }
         
      }

      photoForCreationDto.Url = uploadResult.Uri.ToString();
      photoForCreationDto.PublicId = uploadResult.PublicId;

      var photo = _mapper.Map<Photo>(photoForCreationDto);

        userFromRepo.Photos.Add(photo);
      if(!userFromRepo.Photos.Any(x => x.IsMain)) {
          photo.IsMain = true;
      }


      if(await this._repo.SaveAll()) {
          var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
         return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoToReturn);
      }

        return BadRequest("Could not add the photo");

    }
[HttpPost("{id}/setMain")]

    public async Task<IActionResult> SetMainPhoto(int userId, int id) {
  if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
        return Unauthorized();
      }
      var user = await _repo.getUser(userId); 

      if(!user.Photos.Any(p => p.Id == id)) {
        return Unauthorized();
      }
      var photoFromRepo = await _repo.getPhoto(id);

      if(photoFromRepo.IsMain) {
        return BadRequest("This is already the main photo!");
      }

      var currentMainPhoto = await _repo.getMainPhoto(userId);
      currentMainPhoto.IsMain = false;
      photoFromRepo.IsMain = true;

      if(await _repo.SaveAll()) {
        return NoContent();
      }

      return BadRequest("Photo wasn't set to main. Some problem!");
    }



    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(int userId, int id) {
      if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
        return Unauthorized();
      }
      var user = await _repo.getUser(userId); 

      if(!user.Photos.Any(p => p.Id == id)) {
        return Unauthorized();
      }
      var photoFromRepo = await _repo.getPhoto(id);

      if(photoFromRepo.IsMain) {
        return BadRequest("You cannot delete your main photo!");
      }
      if(photoFromRepo.PublicId == null) {
        return BadRequest("YOu cannot delete this photo!");
      }
      var deleteParams = new DeletionParams(photoFromRepo.PublicId);

     var result = this._cloudinary.Destroy(deleteParams);

     if(result.Result == "ok") {
      _repo.Remove(photoFromRepo);
     }

     if(await _repo.SaveAll()){
       return Ok();
     }

     return BadRequest("Failed to delete the photo!");    }
    
  }
}