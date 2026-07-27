using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Persona> Personas { get; set; }
        public DbSet<Registro> Registros { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Persona>().ToTable("personas");
            modelBuilder.Entity<Registro>().ToTable("registros");

            modelBuilder.Entity<Registro>()
                .HasOne(r => r.Persona)
                .WithMany(p => p.Registros)
                .HasForeignKey(r => r.PersonaId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
