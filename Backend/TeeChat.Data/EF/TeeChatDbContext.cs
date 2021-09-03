using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeeChat.Data.Configurations;
using TeeChat.Data.Entities;

namespace TeeChat.Data.EF
{
    public class TeeChatDbContext : IdentityDbContext<AppUser>
    {
        public DbSet<Message> Messages { get; set; }
        public DbSet<Chat> Chats { get; set; }

        public TeeChatDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfiguration(new MessageConfiguration());
            builder.ApplyConfiguration(new AppUserConfiguration());
        }
    }
}