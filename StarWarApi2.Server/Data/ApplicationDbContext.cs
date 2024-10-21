using Microsoft.EntityFrameworkCore;
using StarWarApi2.Server.Models;
using System.Collections.Generic;

namespace StarWarApi2.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Starship> Starships { get; set; }
    }
}