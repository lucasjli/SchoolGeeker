using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;

[Route("api/[controller]")]
[ApiController]
public class SchoolMediasController : ControllerBase
{
    private readonly SchoolGeekerContext _context;

    public SchoolMediasController(SchoolGeekerContext context)
    {
        _context = context;
    }

    // Create (POST)
    [HttpPost]
    public async Task<IActionResult> CreateSchoolMedia([FromBody] SchoolMedia schoolMedia)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.SchoolMedia.Add(schoolMedia);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSchoolMedia), new { id = schoolMedia.MediaID }, schoolMedia);
    }

    // Read (GET all)
    [HttpGet]
    public async Task<IActionResult> GetSchoolMedias()
    {
        var schoolMedias = await _context.SchoolMedia.ToListAsync();
        return Ok(schoolMedias);
    }

    // Read (GET by MediaID)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSchoolMedia(int id)
    {
        var schoolMedia = await _context.SchoolMedia.FindAsync(id);
        if (schoolMedia == null)
            return NotFound();
        return Ok(schoolMedia);
    }

    // Read (GET by SchoolID)
    [HttpGet("school/{schoolId}")]
    public async Task<IActionResult> GetMediasBySchool(int schoolId)
    {
        var medias = await _context.SchoolMedia
            .Where(m => m.SchoolID == schoolId)
            .ToListAsync();
        return Ok(medias);
    }

    // Update (PUT)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSchoolMedia(int id, [FromBody] SchoolMedia schoolMedia)
    {
        if (id != schoolMedia.MediaID || !ModelState.IsValid)
            return BadRequest();

        _context.Entry(schoolMedia).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SchoolMediaExists(id))
                return NotFound();
            throw;
        }
        return NoContent();
    }

    // Delete (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchoolMedia(int id)
    {
        var schoolMedia = await _context.SchoolMedia.FindAsync(id);
        if (schoolMedia == null)
            return NotFound();

        _context.SchoolMedia.Remove(schoolMedia);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool SchoolMediaExists(int id)
    {
        return _context.SchoolMedia.Any(e => e.MediaID == id);
    }
}