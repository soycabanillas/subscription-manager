using System.Text.Json.Serialization;
using Backend.Services.Auth;
using Backend.Services.Customers;
using Backend.Services.Statistics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;
using Backend.Services.Common;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure JWT authentication and authorization
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
            ValidateLifetime = true
        };
    });
builder.Services.AddAuthorization();

if (builder.Environment.IsDevelopment())
{
    builder.WebHost.UseKestrelHttpsConfiguration();
}

var app = builder.Build();

// Use authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Map endpoints using extension methods
app.MapAuthEndpoints();
app.MapDashboardEndpoints();
app.MapCustomerEndpoints();

app.Run();

[JsonSerializable(typeof(DateTime?))]
[JsonSerializable(typeof(DateOnly?))]
[JsonSerializable(typeof(AuthResponse))]
[JsonSerializable(typeof(LoginRequest))]
[JsonSerializable(typeof(CreateCustomerRequest))]
[JsonSerializable(typeof(UpdateCustomerRequest))]
[JsonSerializable(typeof(Customer))]
[JsonSerializable(typeof(Customer[]))]
[JsonSerializable(typeof(PaginatedResponse<Customer>))]
[JsonSerializable(typeof(DashboardStats))]
[JsonSerializable(typeof(ChartData))]
[JsonSerializable(typeof(ChartData[]))]
[JsonSerializable(typeof(List<ChartData>))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{

}
