using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;

[Route("api/[controller]")]
[ApiController]
public class UserFavoritesController : ControllerBase
{
    private readonly SchoolGeekerContext _context;

    public UserFavoritesController(SchoolGeekerContext context)
    {
        _context = context;
    }

    // CREATE (POST): api/userfavorites
    [HttpPost]
    public async Task<IActionResult> CreateUserFavorite([FromBody] UserFavorite userFavorite)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if the unique constraint (UserID, SchoolID) already exists
        if (await UserFavoriteExists(userFavorite.UserID, userFavorite.SchoolID))
        {
            return Conflict("This user has already favorited this school.");
        }

        _context.UserFavorites.Add(userFavorite);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserFavorite), new { id = userFavorite.ID }, userFavorite);
    }

    // READ ALL (GET): api/userfavorites
    [HttpGet]
    public async Task<IActionResult> GetUserFavorites()
    {
        var userFavorites = await _context.UserFavorites.ToListAsync();
        return Ok(userFavorites);
    }

    // READ BY ID (GET): api/userfavorites/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserFavorite(int id)
    {
        var userFavorite = await _context.UserFavorites.FindAsync(id);

        if (userFavorite == null)
        {
            return NotFound();
        }

        return Ok(userFavorite);
    }

    // UPDATE (PUT): api/userfavorites/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserFavorite(int id, [FromBody] UserFavorite userFavorite)
    {
        if (id != userFavorite.ID || !ModelState.IsValid)
        {
            return BadRequest();
        }

        _context.Entry(userFavorite).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserFavoriteExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE (DELETE): api/userfavorites/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserFavorite(int id)
    {
        var userFavorite = await _context.UserFavorites.FindAsync(id);

        if (userFavorite == null)
        {
            return NotFound();
        }

        _context.UserFavorites.Remove(userFavorite);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UserFavoriteExists(int id)
    {
        return _context.UserFavorites.Any(e => e.ID == id);
    }

    private async Task<bool> UserFavoriteExists(int userId, int schoolId)
    {
        return await _context.UserFavorites.AnyAsync(e => e.UserID == userId && e.SchoolID == schoolId);
    }
}