namespace AgendaApp.Models;
public sealed class Appointment { public Guid Id { get; set; } public Guid CustomerId { get; set; } public string Title { get; set; } = ""; public DateTime StartTime { get; set; } public DateTime EndTime { get; set; } public string Status { get; set; } = "requested"; public string? Notes { get; set; } }
