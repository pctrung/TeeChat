using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace TeeChat.Application.Interfaces
{
    public interface IStorageService
    {
        string GetImageUrl(string fileName);

        Task<string> SaveImageAsync(IFormFile file);

        Task DeleteFileAsync(string fileName);
    }
}