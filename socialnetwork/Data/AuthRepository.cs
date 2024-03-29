using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using socialnetwork.Models;

namespace socialnetwork.Data
{
  public class AuthRepository : IAuthRepository
  {
    private readonly DataContext _context;

    public AuthRepository(DataContext context)
    {
      this._context = context;

    }
    public async Task<User> Login(string username, string password)
    {
      var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(x => x.Username == username);

      if(user == null) {
          return null;
      }

      if(!VerifyPasswordHash(user.PasswordSalt, user.PasswordHash, password)) {
          return null;
      }

      return user;
    }

    private bool VerifyPasswordHash(byte[] passwordSalt, byte[] passwordHash, string password)
    {
        using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
      {
        
        var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

        for(var i=0; i < computeHash.Length; i++) {
            if(passwordHash[i] != computeHash[i]) {
                return false;
            }
        }
      }
      return true;
    }

    public async Task<User> Registration(User user, string password)
    {
      byte[] passwordHash, passwordSalt;

      CreatePasswordHash(password, out passwordHash, out passwordSalt);

      user.PasswordHash = passwordHash;
      user.PasswordSalt = passwordSalt;

        await this._context.Users.AddAsync(user);
        await this._context.SaveChangesAsync();

        return user;

    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      using (var hmac = new System.Security.Cryptography.HMACSHA512())
      {
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      }
    }

    public async Task<bool> UserExists(string username)
    {
    if( await this._context.Users.AnyAsync(x => x.Username == username)) {
        return true;
    } 

    return false;
    }

   
  }
}