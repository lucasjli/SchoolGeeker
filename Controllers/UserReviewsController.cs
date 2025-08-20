using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;


[Route("api/[controller]")]
[ApiController]
public class UserReviewsController : ControllerBase
{
    private readonly SchoolGeekerContext _context;

    public UserReviewsController(SchoolGeekerContext context)
    {
        _context = context;
    }

    // CREATE (POST): api/userreviews
    [HttpPost]
    public async Task<IActionResult> CreateUserReview([FromBody] UserReview userReview)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.UserReviews.Add(userReview);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserReview), new { id = userReview.ID }, userReview);
    }

    // READ ALL (GET): api/userreviews
    [HttpGet]
    public async Task<IActionResult> GetUserReviews()
    {
        var userReviews = await _context.UserReviews.ToListAsync();
        return Ok(userReviews);
    }

    // READ BY ID (GET): api/userreviews/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserReview(int id)
    {
        var userReview = await _context.UserReviews.FindAsync(id);

        if (userReview == null)
        {
            return NotFound();
        }

        return Ok(userReview);
    }

    // UPDATE (PUT): api/userreviews/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserReview(int id, [FromBody] UserReview userReview)
    {
        if (id != userReview.ID || !ModelState.IsValid)
        {
            return BadRequest();
        }

        _context.Entry(userReview).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserReviewExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE (DELETE): api/userreviews/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserReview(int id)
    {
        var userReview = await _context.UserReviews.FindAsync(id);

        if (userReview == null)
        {
            return NotFound();
        }

        _context.UserReviews.Remove(userReview);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UserReviewExists(int id)
    {
        return _context.UserReviews.Any(e => e.ID == id);
    }
}