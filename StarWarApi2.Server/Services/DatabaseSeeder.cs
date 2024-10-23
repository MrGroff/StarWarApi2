using System.Net.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using StarWarApi2.Server.Data;
using StarWarApi2.Server.Models;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace StarWarApi2.Server.Services
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;
        

        public DatabaseSeeder(ApplicationDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
            
        }

        public async Task SeedAsync()
        {
            // Ensure the table exists before seeding
            await CreateTableIfNotExistsAsync();

            if (await _context.Starships.AnyAsync())
            {
                return; // Database has been seeded
            }

            var response = await _httpClient.GetStringAsync("https://swapi.dev/api/starships/");
            var starshipData = JsonConvert.DeserializeObject<StarshipResponse>(response);
            foreach (var starship in starshipData.Results)
            {
                _context.Starships.Add(new Starship
                {
                    Name = starship.Name,
                    Model = starship.Model,
                    Manufacturer = starship.Manufacturer,
                    CostInCredits = starship.CostInCredits,
                    CargoCapacity = starship.CargoCapacity,
                    Consumables = starship.Consumables,
                    Crew = starship.Crew,
                    Length = starship.Length,
                    MaxAtmospheringSpeed = starship.MaxAtmospheringSpeed,
                    MGLT = starship.MGLT,
                    StarshipClass = starship.StarshipClass,
                    Passengers = starship.Passengers,
                    Films = starship.Films,
                    HyperdriveRating = starship.HyperdriveRating,
                    Created = starship.Created,
                    Edited = starship.Edited
                });
            }

            await _context.SaveChangesAsync();
        }

        private async Task CreateTableIfNotExistsAsync()
        {
            const string createTableQuery = @"
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Starships' AND xtype='U')
                BEGIN
                    CREATE TABLE Starships (
                        Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
                        Name NVARCHAR(255) NULL,
                        Model NVARCHAR(255) NULL,
                        Manufacturer NVARCHAR(255) NULL,
                        CostInCredits NVARCHAR(255) NULL,
                        CargoCapacity NVARCHAR(255) NULL,
                        Consumables NVARCHAR(255) NULL,
                        Crew NVARCHAR(255) NULL,
                        Length NVARCHAR(255) NULL,
                        MaxAtmospheringSpeed NVARCHAR(255) NULL,
                        MGLT NVARCHAR(255) NULL,
                        StarshipClass NVARCHAR(255) NULL,
                        Passengers NVARCHAR(255) NULL,
                        Films NVARCHAR(MAX) NULL,
                        HyperdriveRating NVARCHAR(255) NULL,
                        Created DATETIME NULL,
                        Edited DATETIME NULL
                    );
                END";

            using (var connection = new SqlConnection(_context.Database.GetDbConnection().ConnectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(createTableQuery, connection))
                {
                    await command.ExecuteNonQueryAsync();
                }
            }
        }

        private class StarshipResponse
        {
            public Starship[] Results { get; set; }
        }
    }
}