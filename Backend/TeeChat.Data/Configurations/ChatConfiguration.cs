using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeeChat.Data.Entities;

namespace TeeChat.Data.Configurations
{
    public class ChatConfiguration : IEntityTypeConfiguration<Chat>
    {
        public void Configure(EntityTypeBuilder<Chat> builder)
        {
            builder.ToTable("Chats");
            builder.HasKey(x => x.Id);
            builder.HasMany(x => x.Participants).WithMany(x => x.Chats);
            builder.Property(x => x.CreatorUserName);
            builder.Property(x => x.Name).HasMaxLength(100);
        }
    }
}