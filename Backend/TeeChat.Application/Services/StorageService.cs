using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TeeChat.Application.Interfaces;
using TeeChat.Utilities.Constants;

namespace TeeChat.Application.Services
{
    public class StorageService : IStorageService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _imagePath;
        private readonly string _imageUrl;
        private readonly string[] IMAGE_TYPES = new string[] { ".tiff", ".tiff", ".jpg", ".jpeg", ".gif", ".png" };
        private const int OneMegaBytes = 1 * 1024 * 1024;

        public StorageService(IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _imageUrl = $"{_httpContextAccessor.HttpContext.Request.Host.Value}/{SystemConstants.IMAGE_FOLDER}";
            if (string.IsNullOrWhiteSpace(webHostEnvironment.WebRootPath))
            {
                webHostEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }
            _imagePath = Path.Combine(webHostEnvironment.WebRootPath, SystemConstants.IMAGE_FOLDER);
        }

        public string GetImageUrl(string fileName)
        {
            if (!string.IsNullOrWhiteSpace(_imageUrl) && !string.IsNullOrWhiteSpace(fileName))
            {
                return $"https://{_imageUrl}/{fileName}";
            }
            return "";
        }

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            if (file == null)
            {
                throw new Exception("Cannot add null file");
            }
            var originalFileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

            var extension = Path.GetExtension(originalFileName);
            if (Array.IndexOf(IMAGE_TYPES, extension.ToLower()) < 0)
            {
                throw new Exception("Please upload image file!");
            }

            var fileSize = file.Length;
            if (fileSize > OneMegaBytes)
            {
                throw new Exception("Please upload file less than 1MB!");
            }

            var fileName = $"{Guid.NewGuid()}{extension}";

            fileName ??= string.Empty;

            if (!Directory.Exists(_imagePath))
            {
                Directory.CreateDirectory(_imagePath);
            }
            var filePath = Path.Combine(_imagePath, fileName);

            using var output = new FileStream(filePath, FileMode.Create);

            var mediaBinaryStream = file.OpenReadStream();
            await mediaBinaryStream.CopyToAsync(output);

            return fileName;
        }

        public async Task DeleteFileAsync(string fileName)
        {
            var filePath = Path.Combine(_imagePath, fileName);

            if (File.Exists(filePath))
            {
                await Task.Run(() => File.Delete(filePath));
            }
        }
    }
}