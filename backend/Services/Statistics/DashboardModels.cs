namespace Backend.Services.Statistics;

public class DashboardStats
{
    public int TotalUsers { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal ConversionRate { get; set; }
    public decimal UserGrowth { get; set; }
    public decimal RevenueGrowth { get; set; }
    public decimal OrderGrowth { get; set; }
    public decimal ConversionGrowth { get; set; }
}

public class ChartData
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Users { get; set; }
    public int Orders { get; set; }
}
