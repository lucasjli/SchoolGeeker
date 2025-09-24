using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;

using Google.Apis.Auth;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly SchoolGeekerContext _context;

    public UsersController(SchoolGeekerContext context)
    {
        _context = context;
    }

    // Google login DTO
    public class GoogleLoginDto
    {
        public string? IdToken { get; set; }
    }

    // Google login API
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        if (string.IsNullOrEmpty(dto.IdToken))
            return BadRequest("Missing Google token");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);
        }
        catch
        {
            return BadRequest("Invalid Google token");
        }

    // Find or create user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);
        if (user == null)
        {
            user = new User
            {
                Username = payload.Name ?? payload.Email,
                Email = payload.Email,
                PasswordHash = "", // Google user can leave blank
                AvatarURL = payload.Picture
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        return Ok(user);
    }

    // Email and Password login interface
    public class LoginDto
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return BadRequest("Email and password are required");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.PasswordHash == dto.Password);
        if (user == null)
            return Unauthorized("Invalid email or password");

        return Ok(user);
    }

    // Create (POST)
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    // Read (GET all)
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // Read (GET by ID)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();
        return Ok(user);
    }

    // Update (PUT)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
    {
    // Only update username and avatar URL
        var dbUser = await _context.Users.FindAsync(id);
        if (dbUser == null)
            return NotFound();

        dbUser.Email = user.Email;
        dbUser.PasswordHash = user.PasswordHash;
        dbUser.Username = user.Username ?? dbUser.Username;
        dbUser.AvatarURL = user.AvatarURL ?? dbUser.AvatarURL;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
                return NotFound();
            throw;
        }
        return Ok(dbUser);
    }

    // Delete (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool UserExists(int id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}