using Backend.Services.Customers;

namespace Backend.Services.Auth;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public User User { get; set; } = new();
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
