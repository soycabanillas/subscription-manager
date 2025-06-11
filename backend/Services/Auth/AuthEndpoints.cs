// filepath: /home/alejandro/repos/net_test/backend/Services/Auth/AuthEndpoints.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Services.Customers;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var authApi = app.MapGroup("/api/auth").WithTags("Auth");

        authApi.MapPost("/login", Results<Ok<AuthResponse>, UnauthorizedHttpResult, BadRequest> (LoginRequest request) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return TypedResults.BadRequest();

            // Dummy user store with fixed credentials
            var accounts = new Dictionary<string, (string Password, User User)>
            {
                ["admin@example.com"] = (
                    "password",
                    new User { Id = "1", Email = "admin@example.com", Name = "Admin User", Role = "admin" }
                )
            };

            if (!accounts.TryGetValue(request.Email, out var account) || account.Password != request.Password)
                return TypedResults.Unauthorized();

            // Generate JWT token
            var jwtSettings = app.Configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, account.User.Id),
                new Claim(ClaimTypes.Name, account.User.Name),
                new Claim(ClaimTypes.Email, account.User.Email),
                new Claim(ClaimTypes.Role, account.User.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            var response = new AuthResponse
            {
                Token = tokenString,
                User = account.User
            };

            return TypedResults.Ok(response);
        }).WithName("Login");
    }
}