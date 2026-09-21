namespace AgendaApp.Models;
public sealed class Review { public Guid Id { get; set; } public Guid CustomerId { get; set; } public int Rating { get; set; } public string? Comment { get; set; } public DateTime CreatedAt { get; set; } }
