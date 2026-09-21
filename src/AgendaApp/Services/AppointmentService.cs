using AgendaApp.Models;

namespace AgendaApp.Services;

public sealed class AppointmentService
{
    private readonly SupabaseClient _client;
    public AppointmentService(SupabaseClient client) => _client = client;
    public Task<List<Appointment>> GetAppointments() => _client.GetAppointmentsAsync();
    public Task CreateAppointment(Appointment appointment) => _client.CreateAppointmentAsync(appointment);
    public Task UpdateAppointmentStatus(Guid id, string status) => _client.UpdateAppointmentStatusAsync(id, status);
}
