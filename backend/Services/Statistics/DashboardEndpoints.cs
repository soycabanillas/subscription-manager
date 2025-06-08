using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Services.Statistics;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        var dashboardApi = app.MapGroup("/api/dashboard").WithTags("Dashboard");
        
        dashboardApi.MapGet("/stats", () =>
        {
            var stats = new DashboardStats
            {
                TotalUsers = 12543,
                TotalRevenue = 245890.50m,
                TotalOrders = 3456,
                ConversionRate = 3.2m,
                UserGrowth = 12.5m,
                RevenueGrowth = 8.3m,
                OrderGrowth = 15.2m,
                ConversionGrowth = -2.1m
            };
            return TypedResults.Ok(stats);
        }).WithName("GetDashboardStats");

        dashboardApi.MapGet("/chart-data", Results<Ok<List<ChartData>>, BadRequest> (DateTime? from, DateTime? to) =>
        {
            var startDate = from ?? DateTime.UtcNow.AddDays(-30);
            var endDate = to ?? DateTime.UtcNow;
            
            var data = new List<ChartData>();
            var random = new Random();
            
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                data.Add(new ChartData
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Revenue = random.Next(5000, 15000),
                    Users = random.Next(100, 500),
                    Orders = random.Next(50, 200)
                });
            }

            return TypedResults.Ok(data);
        }).WithName("GetDashboardChartData");
    }
}
