using System.Net.Http;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StarWarApi2.Server.Data;
using StarWarApi2.Server.Models;

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
            if (await _context.Starships.AnyAsync())
            {
                return; // Database has been seeded
            }

            var response = await _httpClient.GetStringAsync("https://swapi.dev/api/starships/");
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true // Allows case insensitive property mapping
            };

            var starshipData = JsonSerializer.Deserialize<StarshipResponse>(response, options);
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
                    Edited =starship.Edited
                });
            }

            await _context.SaveChangesAsync();
        }

        private class StarshipResponse
        {
            public Starship[] Results { get; set; }
        }
    }
}