using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using socialnetwork.Data;
using socialnetwork.Dtos;
using socialnetwork.Models;

namespace socialnetwork.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _repo;
    private readonly IConfiguration _config;
    private readonly IMapper _mapper;
    public AuthController(IAuthRepository repo, IConfiguration config, IMapper _mapper)
    {
      this._mapper = _mapper;
      _config = config;
      _repo = repo;

    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
    {


      userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

      if (await this._repo.UserExists(userForRegisterDto.Username))
      {
        return BadRequest("Username already exist");
      }

      var user = _mapper.Map<User>(userForRegisterDto);

      var createdUser = await this._repo.Registration(user, userForRegisterDto.Password);
    var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);
      return CreatedAtRoute("GetUser", new { controller = "Users", id=createdUser.Id},  userToReturn);
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
    {


      var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

      if (userFromRepo == null)
      {
        return Unauthorized();
      }

      var claims = new[] {
      new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
      new Claim(ClaimTypes.Name, userFromRepo.Username)
    };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));


      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

      var tokenDescription = new SecurityTokenDescriptor()
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = creds
      };
      var user = this._mapper.Map<UserForList>(userFromRepo);
  var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescription);
      return Ok(new
      {
        token = tokenHandler.WriteToken(token),
        user
      });


    }
  }
}