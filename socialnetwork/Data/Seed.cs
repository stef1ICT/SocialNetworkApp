using System.Collections.Generic;
using Newtonsoft.Json;
using socialnetwork.Models;

namespace socialnetwork.Data
{
  public class Seed
  {
    public DataContext _context { get; }
    public Seed(DataContext context)
    {
     _context= context;
    }




    public void seedUsers() {
        var userData = System.IO.File.ReadAllText("Data/UserSeed.json");
        var users = JsonConvert.DeserializeObject<List<User>>(userData);
        foreach (var user in users)
        { 
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash("password", out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.Username = user.Username.ToLower();
            this._context.Add(user);

        }

        this._context.SaveChanges();


    }


       private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      using (var hmac = new System.Security.Cryptography.HMACSHA512())
      {
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      }
    }
  }
}