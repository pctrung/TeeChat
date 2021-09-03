using System.Threading.Tasks;
using TeeChat.Models.ViewModels;

namespace TeeChat.Application.Interfaces
{
    public interface IMessageService
    {
        Task<MessageViewModel> GetByIdAsync(int id);
    }
}