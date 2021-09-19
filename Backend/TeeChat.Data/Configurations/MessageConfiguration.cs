using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeeChat.Data.Entities;

namespace TeeChat.Data.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.ToTable("Messages");
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Chat).WithMany(x => x.Messages).IsRequired();
            builder.HasOne(x => x.Sender).WithMany(x => x.SentMessages).IsRequired();
            builder
                .HasMany(x => x.ReadByUsers)
                .WithMany(x => x.ReadMessages)
                .UsingEntity(
                    join =>
                    {
                        join.ToTable("MessageStatuses");
                    }
                );
        }
    }
}