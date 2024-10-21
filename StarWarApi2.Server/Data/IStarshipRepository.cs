using StarWarApi2.Server.Models;

namespace StarWarApi2.Server.Data
{
    public interface IStarshipRepository
    {
        Task<IEnumerable<Starship>> GetAllStarshipsAsync();
        Task CreateStarship(Starship newStarship);
        Task<IEnumerable<string>> GetManufacturers();
        Task<Starship> UpdateStarship(Starship updatedStarship);
        Task<bool> DeleteStarship(int id);
    }
}
