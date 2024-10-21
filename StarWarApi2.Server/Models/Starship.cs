using Newtonsoft.Json;

namespace StarWarApi2.Server.Models
{
    public class Starship
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Model { get; set; }
        public string Manufacturer { get; set; }
        [JsonProperty("cost_in_credits")] // Match JSON key with underscore
        public string CostInCredits { get; set; }
        [JsonProperty("cargo_capacity")] // Match JSON key with underscore
        public string CargoCapacity { get; set; }
        public string Consumables { get; set; }
        public string Crew { get; set; }
        public string Length { get; set; }
        [JsonProperty("max_atmosphering_speed")]// Match JSON key with underscore
        public string MaxAtmospheringSpeed { get; set; }
        public string MGLT { get; set; }
        [JsonProperty("starship_class")]// Match JSON key with underscore
        public string StarshipClass { get; set; }
        public string Passengers { get; set; }
        public string[] Films { get; set; }
        [JsonProperty("hyperdrive_rating")]// Match JSON key with underscore
        public string HyperdriveRating { get; set; }
        public DateTime Created { get; set; }
        public DateTime Edited { get; set; }
    }
}
