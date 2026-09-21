namespace AgendaApp.Models;
public sealed class ServiceItem { public Guid Id { get; set; } public string Name { get; set; } = ""; public string Description { get; set; } = ""; public decimal? PriceIndication { get; set; } public bool IsActive { get; set; } = true; }
