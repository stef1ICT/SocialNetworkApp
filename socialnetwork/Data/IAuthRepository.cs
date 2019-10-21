using System.Threading.Tasks;
using socialnetwork.Models;

namespace socialnetwork.Data
{
    public interface IAuthRepository
    {
         Task<User> Registration(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
   }
}