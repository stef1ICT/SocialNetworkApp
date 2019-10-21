using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using socialnetwork.Data;
using socialnetwork.Dtos;
using socialnetwork.Helpers;
using socialnetwork.Models;

namespace socialnetwork.Controllers
{
  [ServiceFilter(typeof(LogUserActivity))]
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {

    private readonly IDatingRepository _repo;
    private readonly IMapper _mapper;

    public UsersController(IDatingRepository repo, IMapper mapper)
    {
      _repo = repo;
      _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> getUsers([FromQuery]UserParams userParams) {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var currentUser = await _repo.getUser(currentUserId);
        userParams.UserId = currentUserId;
        
        if(string.IsNullOrEmpty(userParams.Gender)){
          userParams.Gender = (currentUser.Gender == "male") ? "female" : "male";
        }
        var users = await _repo.getUsers(userParams);
        var usersToReturn = _mapper.Map<IEnumerable<UserForList>>(users);
        Response.AddPagination(users.CurrentPage, users.TotalPage, users.PageSize, users.TotalCount);
        return Ok(usersToReturn);
    }

    [HttpGet("{id}", Name="GetUser")]
    public async Task<IActionResult> getUser(int id) {
        var user = await _repo.getUser(id);
        var userToReturn = _mapper.Map<UserForDetailedDto>(user);
        return Ok(userToReturn);
    }

    [HttpPut("{id}")]

    public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto) {
      if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
        return Unauthorized();
      }

      var userFromRepo = await _repo.getUser(id);
      _mapper.Map(userForUpdateDto, userFromRepo);
      if(await _repo.SaveAll()) {
        return NoContent();
      }
      throw new Exception($"Updating user {id} failed on save");
    }
    [HttpPost("{id}/like/{recipientId}")]
    public async Task<IActionResult> LikeUser(int id, int recipientId) {
       if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
        return Unauthorized();
      }
      var like = await _repo.getLike(id, recipientId);
      if(like != null) {
        return BadRequest("You already like this user!");
      }
        

        if(await _repo.getUser(recipientId) == null) {
          return NotFound();
        }
        like = new Like {
          LikerId = id,
          LikeeId = recipientId
        };
        _repo.Add<Like>(like);

        if(await _repo.SaveAll()) {
          return Ok();
        } 

        return BadRequest("Failed with like this user!");
    }

  }
}