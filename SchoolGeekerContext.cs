using Microsoft.EntityFrameworkCore;
using SchoolGeeker;

public class SchoolGeekerContext : DbContext
{
    public DbSet<School> Schools { get; set; }
    public DbSet<User> Users { get; set; }

    public SchoolGeekerContext(DbContextOptions<SchoolGeekerContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<School>(entity =>
        {
            entity.Property(e => e.ID).ValueGeneratedOnAdd();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.City).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Latitude).IsRequired();
            entity.Property(e => e.Longitude).IsRequired();
            entity.Property(e => e.Introduction).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Logo).HasMaxLength(255);
            entity.Property(e => e.Telephone).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EnrolmentInfo).HasMaxLength(1000);
            entity.Property(e => e.EnrolmentForm).HasMaxLength(255);
            entity.Property(e => e.SchoolZone).HasMaxLength(200);
            entity.Property(e => e.MoreInfo).HasMaxLength(500);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AvatarURL).HasMaxLength(255);
        });
    }
}