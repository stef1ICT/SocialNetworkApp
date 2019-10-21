using System.Collections.Generic;
using System.Threading.Tasks;
using socialnetwork.Helpers;
using socialnetwork.Models;

namespace socialnetwork.Data
{
    public interface IDatingRepository
    {
         void Add<T> (T entity) where T:class;
         void Remove<T>(T entity) where T:class;
         Task<bool> SaveAll();
         Task<PagedList<User>> getUsers(UserParams userParams);
         Task<User> getUser(int id);
        Task<Photo> getPhoto(int id);
        Task<Photo> getMainPhoto(int userId);
        Task<Like> getLike(int userId, int recipientId);
        Task<Message> getMessage(int id);
        Task<PagedList<Message>> getMessageForUser();
        Task<IEnumerable<Message>> getMessageThreed(int id, int recipientId);
    }
}
