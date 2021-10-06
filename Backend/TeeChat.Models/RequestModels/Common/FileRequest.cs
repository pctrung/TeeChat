using Microsoft.AspNetCore.Http;

namespace TeeChat.Models.RequestModels.Common
{
    public class FileRequest
    {
        public IFormFile File { get; set; }
    }
}