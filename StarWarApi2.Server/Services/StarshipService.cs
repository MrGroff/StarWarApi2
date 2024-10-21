using StarWarApi2.Server.Data;
using StarWarApi2.Server.Models;

namespace StarWarApi2.Server.Services
{
    public class StarshipService
    {
        private readonly IStarshipRepository _starshipRepository;

        public StarshipService(IStarshipRepository starshipRepository)
        {
            _starshipRepository = starshipRepository;
        }

        public async Task<IEnumerable<Starship>> GetAllStarships()
        {
            return await _starshipRepository.GetAllStarshipsAsync();
        }
        public async Task CreateStarship(Starship newStarship)
        {
            await _starshipRepository.CreateStarship(newStarship);
        }

        // New method to get manufacturers
        public async Task<IEnumerable<string>> GetManufacturers()
        {
            return await _starshipRepository.GetManufacturers();
        }
         public async Task<Starship> UpdateStarship(Starship updatedStarship)
        {
            return await _starshipRepository.UpdateStarship(updatedStarship);
        }

        public async Task<bool> DeleteStarship(int id)
        {
            return await _starshipRepository.DeleteStarship(id);
        }

    }
}
