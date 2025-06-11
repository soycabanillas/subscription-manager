using Backend.Services.Common;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Services.Customers;

public static class CustomerEndpoints
{
    private static readonly List<Customer> customers = new()
    {
        new() { Id = Guid.NewGuid().ToString(), Name = "John Doe", Email = "john@example.com", Status = "active", TotalSpent = 1250.00m, Orders = 5, JoinedAt = DateTime.UtcNow.AddDays(-30) },
        new() { Id = Guid.NewGuid().ToString(), Name = "Jane Smith", Email = "jane@example.com", Status = "active", TotalSpent = 2100.50m, Orders = 12, JoinedAt = DateTime.UtcNow.AddDays(-45) },
        new() { Id = Guid.NewGuid().ToString(), Name = "Bob Johnson", Email = "bob@example.com", Status = "inactive", TotalSpent = 450.00m, Orders = 2, JoinedAt = DateTime.UtcNow.AddDays(-60) },
        new() { Id = Guid.NewGuid().ToString(), Name = "Alice Brown", Email = "alice@example.com", Status = "active", TotalSpent = 3200.75m, Orders = 18, JoinedAt = DateTime.UtcNow.AddDays(-20) },
        new() { Id = Guid.NewGuid().ToString(), Name = "Charlie Wilson", Email = "charlie@example.com", Status = "active", TotalSpent = 890.25m, Orders = 7, JoinedAt = DateTime.UtcNow.AddDays(-15) }
    };

    public static void MapCustomerEndpoints(this WebApplication app)
    {
        var customersApi = app.MapGroup("/api/customers").WithTags("Customers").RequireAuthorization();

        customersApi.MapGet("/", Results<Ok<PaginatedResponse<Customer>>, BadRequest> (int page = 1, int limit = 10, string? search = null, string? sortBy = null, string? sortOrder = "asc") =>
        {
            IEnumerable<Customer> filteredCustomers = customers;

            // Search
            if (!string.IsNullOrEmpty(search))
            {
                filteredCustomers = filteredCustomers.Where(c =>
                    c.Name.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    c.Email.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            // Sort
            if (!string.IsNullOrEmpty(sortBy))
            {
                filteredCustomers = sortBy.ToLower() switch
                {
                    "name" => sortOrder == "desc"
                        ? filteredCustomers.OrderByDescending(c => c.Name)
                        : filteredCustomers.OrderBy(c => c.Name),
                    "totalspent" => sortOrder == "desc"
                        ? filteredCustomers.OrderByDescending(c => c.TotalSpent)
                        : filteredCustomers.OrderBy(c => c.TotalSpent),
                    _ => filteredCustomers.OrderBy(c => c.Name)
                };
            }
            else
            {
                filteredCustomers = filteredCustomers.OrderBy(c => c.Name);
            }

            var total = filteredCustomers.Count();
            var customersList = filteredCustomers
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            var response = new PaginatedResponse<Customer>
            {
                Data = customersList,
                Total = total,
                Page = page,
                Limit = limit,
                TotalPages = (int)Math.Ceiling((double)total / limit)
            };

            return TypedResults.Ok(response);
        }).WithName("GetCustomers");

        customersApi.MapPost("/", Results<Created<Customer>, BadRequest> (CreateCustomerRequest request) =>
        {
            var customer = new Customer
            {
                Id = Guid.NewGuid().ToString(),
                Name = request.Name,
                Email = request.Email,
                Status = request.Status,
                TotalSpent = 0,
                Orders = 0,
                JoinedAt = DateTime.UtcNow
            };

            customers.Add(customer);
            return TypedResults.Created($"/api/customers/{customer.Id}", customer);
        }).WithName("CreateCustomer");

        customersApi.MapGet("/{id}", Results<Ok<Customer>, NotFound> (string id) =>
        {
            var customer = customers.FirstOrDefault(c => c.Id == id);
            return customer == null ? TypedResults.NotFound() : TypedResults.Ok(customer);
        }).WithName("GetCustomerById");

        customersApi.MapPut("/{id}", Results<Ok<Customer>, NotFound, BadRequest> (string id, UpdateCustomerRequest request) =>
        {
            var customer = customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
                return TypedResults.NotFound();

            customer.Name = request.Name;
            customer.Email = request.Email;
            customer.Status = request.Status;

            return TypedResults.Ok(customer);
        }).WithName("UpdateCustomer");

        customersApi.MapDelete("/{id}", Results<NoContent, NotFound> (string id) =>
        {
            var customer = customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
                return TypedResults.NotFound();

            customers.Remove(customer);
            return TypedResults.NoContent();
        }).WithName("DeleteCustomer");
    }
}
