using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StarWarApi2.Server.Data; // Adjust based on your project's namespace
using StarWarApi2.Server.Models; // Adjust based on your project's namespace
using StarWarApi2.Server.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StarWarApi2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StarshipsController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Your DbContext
        private readonly ILogger<StarshipsController> _logger;
        private readonly StarshipService _starshipService;


        public StarshipsController(ApplicationDbContext context, ILogger<StarshipsController> logger, StarshipService starshipService)
        {
            _context = context;
            _logger = logger;
            _starshipService = starshipService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllStarships()
        {
            try
            {
                var starships = await _starshipService.GetAllStarships();
                return Ok(starships);
            }
            catch (Exception ex)
            {
                // Log the error and return a 500 error code
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreateStarship([FromBody] Starship newStarship)
        {
            if (newStarship == null)
            {
                return BadRequest("Starship is null.");
            }

            // You can add validation here for specific fields if needed

            try
            {
                // Set Created and Edited properties to current time
                newStarship.Created = DateTime.UtcNow;
                newStarship.Edited = DateTime.UtcNow;

                await _starshipService.CreateStarship(newStarship);
                return CreatedAtAction(nameof(GetAllStarships), new { id = newStarship.Id }, newStarship);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // GET: api/starships/manufacturers
        [HttpGet("manufacturers")]
        public async Task<IActionResult> GetManufacturers()
        {
            try
            {
                var manufacturers = await _starshipService.GetManufacturers();
                return Ok(manufacturers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateStarship(int id, [FromBody] Starship starship)
        {
            if (starship == null || id != starship.Id)
            {
                return BadRequest("Starship data is invalid.");
            }

            try
            {
                var updatedStarship = await _starshipService.UpdateStarship(starship);
                if (updatedStarship == null)
                {
                    return NotFound();
                }
                return Ok(updatedStarship);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteStarship(string id)
        {
            try
            {
                var convertID = int.Parse(id);
                if (!await _starshipService.DeleteStarship(convertID))
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}

