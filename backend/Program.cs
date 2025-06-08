using System.Text.Json.Serialization;
using Backend.Services.Common;
using Backend.Services.Customers;
using Backend.Services.Statistics;
using Scalar.AspNetCore;

var builder = WebApplication.CreateSlimBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Map endpoints using extension methods
app.MapDashboardEndpoints();
app.MapCustomerEndpoints();

app.Run();

[JsonSerializable(typeof(CreateCustomerRequest))]
[JsonSerializable(typeof(UpdateCustomerRequest))]
[JsonSerializable(typeof(Customer))]
[JsonSerializable(typeof(Customer[]))]
[JsonSerializable(typeof(PaginatedResponse<Customer>))]
[JsonSerializable(typeof(DashboardStats))]
[JsonSerializable(typeof(ChartData))]
[JsonSerializable(typeof(ChartData[]))]
[JsonSerializable(typeof(List<ChartData>))]
[JsonSerializable(typeof(DateTime?))]
[JsonSerializable(typeof(DateOnly?))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{

}
