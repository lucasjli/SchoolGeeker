using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;

[Route("api/[controller]")]
[ApiController]
public class SchoolsController : ControllerBase
{
    private readonly SchoolGeekerContext _context;

    public SchoolsController(SchoolGeekerContext context)
    {
        _context = context;
    }

    // Create (POST)
    [HttpPost]
    public async Task<IActionResult> CreateSchool([FromBody] School school)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Schools.Add(school);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSchool), new { id = school.Id }, school);
    }

    // Read (GET all)
    [HttpGet]
    public async Task<IActionResult> GetSchools()
    {
        var schools = await _context.Schools.ToListAsync();
        return Ok(schools);
    }

    // Read (GET by ID)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSchool(int id)
    {
        var school = await _context.Schools.FindAsync(id);
        if (school == null)
            return NotFound();
        return Ok(school);
    }

    // Update (PUT)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSchool(int id, [FromBody] School school)
    {
        if (id != school.Id || !ModelState.IsValid)
            return BadRequest();

        _context.Entry(school).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SchoolExists(id))
                return NotFound();
            throw;
        }
        return NoContent();
    }

    // Delete (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSchool(int id)
    {
        var school = await _context.Schools.FindAsync(id);
        if (school == null)
            return NotFound();

        _context.Schools.Remove(school);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool SchoolExists(int id)
    {
        return _context.Schools.Any(e => e.Id == id);
    }
}