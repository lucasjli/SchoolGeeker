using Microsoft.EntityFrameworkCore;
using SchoolGeeker.Models;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<SchoolGeekerContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 配置CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://schoolgeeker.com",
                "https://schoolgeeker.com",
                "http://www.schoolgeeker.com", 
                "https://www.schoolgeeker.com",
                "http://localhost:63342"  // 本地开发
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();

app.UseSwaggerUI();

// 启用CORS
app.UseCors("AllowFrontend");

// 启用静态文件服务（用于前端）
app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

// 配置SPA回退
app.MapFallbackToFile("index.html");

app.MapControllers();

app.Run();
