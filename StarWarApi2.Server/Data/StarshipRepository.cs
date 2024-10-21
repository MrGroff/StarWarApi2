using Microsoft.Data.SqlClient;
using StarWarApi2.Server.Models;

namespace StarWarApi2.Server.Data
{
    public class StarshipRepository : IStarshipRepository
    {
        private readonly string _connectionString;

        public StarshipRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Starship>> GetAllStarshipsAsync()
        {
            const string query = @"
        SELECT Id, Name, Model, Manufacturer, CostInCredits, CargoCapacity, Consumables, Crew, Length, MaxAtmospheringSpeed, MGLT, StarshipClass, Passengers, Films, HyperdriveRating, Created, Edited
        FROM Starships";

            var starships = new List<Starship>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            starships.Add(await ReadStarshipAsync(reader));
                        }
                    }
                }
            }

            return starships;
        }
        public async Task CreateStarship(Starship newStarship)
        {
            const string query = @"
                INSERT INTO Starships (Name, Model, Manufacturer, CostInCredits, CargoCapacity, Consumables, 
                                       Crew, Length, MaxAtmospheringSpeed, MGLT, StarshipClass, 
                                       Passengers, HyperdriveRating, Created, Edited)
                VALUES (@Name, @Model, @Manufacturer, @CostInCredits, @CargoCapacity, @Consumables, 
                        @Crew, @Length, @MaxAtmospheringSpeed, @MGLT, @StarshipClass, 
                        @Passengers, @HyperdriveRating, @Created, @Edited)";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    // Set parameters
                    command.Parameters.AddWithValue("@Name", newStarship.Name);
                    command.Parameters.AddWithValue("@Model", newStarship.Model);
                    command.Parameters.AddWithValue("@Manufacturer", newStarship.Manufacturer);
                    command.Parameters.AddWithValue("@CostInCredits", newStarship.CostInCredits);
                    command.Parameters.AddWithValue("@CargoCapacity", newStarship.CargoCapacity);
                    command.Parameters.AddWithValue("@Consumables", newStarship.Consumables);
                    command.Parameters.AddWithValue("@Crew", newStarship.Crew);
                    command.Parameters.AddWithValue("@Length", newStarship.Length);
                    command.Parameters.AddWithValue("@MaxAtmospheringSpeed", newStarship.MaxAtmospheringSpeed);
                    command.Parameters.AddWithValue("@MGLT", newStarship.MGLT);
                    command.Parameters.AddWithValue("@StarshipClass", newStarship.StarshipClass);
                    command.Parameters.AddWithValue("@Passengers", newStarship.Passengers);
                    command.Parameters.AddWithValue("@HyperdriveRating", newStarship.HyperdriveRating);
                    command.Parameters.AddWithValue("@Created", newStarship.Created);
                    command.Parameters.AddWithValue("@Edited", newStarship.Edited);

                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();
                }
            }
        }
        public async Task<Starship> UpdateStarship(Starship updatedStarship)
        {
            const string query = @"
            UPDATE Starships
            SET Name = @Name,
                Model = @Model,
                Manufacturer = @Manufacturer,
                CostInCredits = @CostInCredits,
                CargoCapacity = @CargoCapacity,
                Consumables = @Consumables,
                Crew = @Crew,
                Length = @Length,
                MaxAtmospheringSpeed = @MaxAtmospheringSpeed,
                MGLT = @MGLT,
                StarshipClass = @StarshipClass,
                Passengers = @Passengers,
                HyperdriveRating = @HyperdriveRating,
                Created = @Created,
                Edited = @Edited
            WHERE Id = @Id"; // Assuming there is an Id column in your Starships table

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    // Set parameters
                    command.Parameters.AddWithValue("@Id", updatedStarship.Id);
                    command.Parameters.AddWithValue("@Name", updatedStarship.Name);
                    command.Parameters.AddWithValue("@Model", updatedStarship.Model);
                    command.Parameters.AddWithValue("@Manufacturer", updatedStarship.Manufacturer);
                    command.Parameters.AddWithValue("@CostInCredits", updatedStarship.CostInCredits);
                    command.Parameters.AddWithValue("@CargoCapacity", updatedStarship.CargoCapacity);
                    command.Parameters.AddWithValue("@Consumables", updatedStarship.Consumables);
                    command.Parameters.AddWithValue("@Crew", updatedStarship.Crew);
                    command.Parameters.AddWithValue("@Length", updatedStarship.Length);
                    command.Parameters.AddWithValue("@MaxAtmospheringSpeed", updatedStarship.MaxAtmospheringSpeed);
                    command.Parameters.AddWithValue("@MGLT", updatedStarship.MGLT);
                    command.Parameters.AddWithValue("@StarshipClass", updatedStarship.StarshipClass);
                    command.Parameters.AddWithValue("@Passengers", updatedStarship.Passengers);
                    command.Parameters.AddWithValue("@HyperdriveRating", updatedStarship.HyperdriveRating);
                    command.Parameters.AddWithValue("@Created", updatedStarship.Created);
                    command.Parameters.AddWithValue("@Edited", updatedStarship.Edited);

                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();
                }
            }

            return updatedStarship; // Return the updated starship if needed
        }
        public async Task<bool> DeleteStarship(int id)
        {
            const string query = "DELETE FROM Starships WHERE Id = @Id"; // Adjust the query based on your table structure

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    await connection.OpenAsync();
                    var rowsAffected = await command.ExecuteNonQueryAsync();
                    return rowsAffected > 0; // Return true if a row was deleted, false otherwise
                }
            }
        }
        public async Task<IEnumerable<string>> GetManufacturers()
        {
            const string query = @"
                SELECT DISTINCT Manufacturer 
                FROM Starships";

            var manufacturers = new List<string>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            manufacturers.Add(reader.GetString(0)); // Assuming Manufacturer is the first column
                        }
                    }
                }
            }

            return manufacturers;
        }
        private async Task<Starship> ReadStarshipAsync(SqlDataReader reader)
        {
            return new Starship
            {
                Id = await reader.IsDBNullAsync(0) ? 0 : reader.GetInt32(0),
                Name = await reader.IsDBNullAsync(1) ? string.Empty : reader.GetString(1),
                Model = await reader.IsDBNullAsync(2) ? string.Empty : reader.GetString(2),
                Manufacturer = await reader.IsDBNullAsync(3) ? string.Empty : reader.GetString(3),
                CostInCredits = await reader.IsDBNullAsync(4) ? string.Empty : reader.GetString(4),
                CargoCapacity = await reader.IsDBNullAsync(5) ? string.Empty : reader.GetString(5),
                Consumables = await reader.IsDBNullAsync(6) ? string.Empty : reader.GetString(6),
                Crew = await reader.IsDBNullAsync(7) ? string.Empty : reader.GetString(7),
                Length = await reader.IsDBNullAsync(8) ? string.Empty : reader.GetString(8),
                MaxAtmospheringSpeed = await reader.IsDBNullAsync(9) ? string.Empty : reader.GetString(9),
                MGLT = await reader.IsDBNullAsync(10) ? string.Empty : reader.GetString(10),
                StarshipClass = await reader.IsDBNullAsync(11) ? string.Empty : reader.GetString(11),
                Passengers = await reader.IsDBNullAsync(12) ? string.Empty : reader.GetString(12),

                // Convert string to string array
                Films = await reader.IsDBNullAsync(13) ? new string[0] : reader.GetString(13).Split(','),

                HyperdriveRating = await reader.IsDBNullAsync(14) ? string.Empty : reader.GetString(14),
                Created = await reader.IsDBNullAsync(15) ? DateTime.MinValue : reader.GetDateTime(15),
                Edited = await reader.IsDBNullAsync(16) ? DateTime.MinValue : reader.GetDateTime(16)
            };
        }
    }
}
