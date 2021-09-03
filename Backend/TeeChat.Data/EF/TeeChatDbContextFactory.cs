using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using TeeChat.Utilities.Constants;

namespace TeeChat.Data.EF
{
    public class TeeChatDbContextFactory : IDesignTimeDbContextFactory<TeeChatDbContext>
    {
        public TeeChatDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString(SystemConstants.CONNECTION_NAME);

            var optionsBuilder = new DbContextOptionsBuilder<TeeChatDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new TeeChatDbContext(optionsBuilder.Options);
        }
    }
}