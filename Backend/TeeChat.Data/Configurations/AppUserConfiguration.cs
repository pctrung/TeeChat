using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TeeChat.Data.Entities;

namespace TeeChat.Data.Configurations
{
    public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.ToTable("Users");
            builder.Property(x => x.LastName).IsRequired();
            builder.Property(x => x.FirstName).IsRequired();
            builder.Property(x => x.Email).IsRequired();
        }
    }
}