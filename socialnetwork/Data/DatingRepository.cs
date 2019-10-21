using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using socialnetwork.Helpers;
using socialnetwork.Models;
using socialnetwork.Message;
namespace socialnetwork.Data
{
  public class DatingRepository : IDatingRepository
  {

    private readonly DataContext _context;

    public DatingRepository(DataContext context)
    {
      _context = context;
    }
    public void Add<T>(T entity) where T : class
    {
        _context.Add(entity);
    }

    public async Task<Like> getLike(int userId, int recipientId)
    {
        return await _context.Likes.FirstOrDefaultAsync(l => l.LikerId == userId && l.LikeeId == recipientId);
    }

    public async Task<Photo> getMainPhoto(int userId)
    {
      return await _context.Photos.Where(p => p.UserId == userId)
      .FirstOrDefaultAsync(p => p.IsMain);
    }

    public async Task<Photo> getPhoto(int id)
    {
      var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
      
      return photo;
    }

     

    public async Task<Message> getMessage(int id) {
      return await this._context.Message.FirstOrDefaultAsync(m => m.Id == id);
    }

    public async  Task<PagedList<Message>> getMessageForUser() {
      return  null;
    }

    public async Task<IEnumerable<Message>> getMessageThreed(int id, int recipientId) {
      return null;
    }
    public async Task<User> getUser(int id)
    {
      var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
      return user;
    }

    public async Task<PagedList<User>> getUsers(UserParams userParams)
    {
        var users =  this._context.Users.Include(u => u.Photos).AsQueryable();
        
        users = users.Where(u => u.Id != userParams.UserId);
        users = users.Where(u => u.Gender == userParams.Gender);


        if(userParams.Likers) {
              var likers = await this.GetUserLike(userParams.UserId, userParams.Likers);
              users = users.Where(u => likers.Contains(u.Id));
        } 

        if(userParams.Likees) {
            var Likees = await this.GetUserLike(userParams.UserId, userParams.Likers);
              users = users.Where(u => Likees.Contains(u.Id));
        }



        if(userParams.MinAge != 18 || userParams.MaxAge != 99) {
          var dbMax = DateTime.Today.AddYears(-userParams.MinAge - 1);
          var dbMin = DateTime.Today.AddYears(-userParams.MaxAge);

          users = users.Where(u => u.DateOfBirth > dbMin && u.DateOfBirth < dbMax);
        }
        if(!string.IsNullOrEmpty(userParams.OrderBy)) {
          switch(userParams.OrderBy) {
            case "created":
            users = users.OrderByDescending(x => x.Created);
            break;
            default: 
            users = users.OrderByDescending(x => x.LastActive);
            break;  
          }
        }
        return  await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
    }

    public void Remove<T>(T entity) where T : class
    {
      this._context.Remove(entity);
    }

    public async Task<bool> SaveAll()
    {
     return await this._context.SaveChangesAsync() > 0;
    }



    private async Task<IEnumerable<int>> GetUserLike(int id, bool likers) {

      var user = await _context.Users.Include(u => u.Likers).Include(u => u.Likees).FirstOrDefaultAsync(u => u.Id == id);

      if(likers) {
            return user.Likers.Where(u => u.LikeeId == id).Select(l => l.LikerId);
      } else {
          return user.Likees.Where(l => l.LikerId == id).Select(l => l.LikeeId);
      }
    }
  }
}