using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using AgendaApp.Models;

namespace AgendaApp.Services;

public sealed class SupabaseClient
{
    private readonly HttpClient _http = new();
    private readonly JsonSerializerOptions _json = new() { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower, PropertyNameCaseInsensitive = true };
    private readonly string? _url = Environment.GetEnvironmentVariable("SUPABASE_URL")?.TrimEnd('/');
    private readonly string? _key = Environment.GetEnvironmentVariable("SUPABASE_KEY");
    public bool IsConfigured => !string.IsNullOrWhiteSpace(_url) && !string.IsNullOrWhiteSpace(_key);
    public string ConfigurationMessage => IsConfigured ? "Verbonden met Supabase." : "Supabase is niet ingesteld. Stel SUPABASE_URL en SUPABASE_KEY in en start de app opnieuw.";
    private HttpRequestMessage Request(HttpMethod method, string path)
    {
        if (!IsConfigured) throw new InvalidOperationException(ConfigurationMessage);
        var request = new HttpRequestMessage(method, $"{_url}/rest/v1/{path}");
        request.Headers.Add("apikey", _key); request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _key); return request;
    }
    private async Task<List<T>> GetAsync<T>(string path)
    {
        using var response = await _http.SendAsync(Request(HttpMethod.Get, path)); response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<List<T>>(_json) ?? [];
    }
    public Task<List<Appointment>> GetAppointmentsAsync() => GetAsync<Appointment>("appointments?select=*&order=start_time.asc");
    public Task<List<ServiceItem>> GetServicesAsync() => GetAsync<ServiceItem>("services?select=*&is_active=eq.true&order=name.asc");
    public async Task CreateAppointmentAsync(Appointment appointment)
    {
        using var request = Request(HttpMethod.Post, "appointments"); request.Headers.Add("Prefer", "return=representation"); request.Content = new StringContent(JsonSerializer.Serialize(appointment, _json), Encoding.UTF8, "application/json");
        using var response = await _http.SendAsync(request); response.EnsureSuccessStatusCode();
    }
    public async Task UpdateAppointmentStatusAsync(Guid id, string status)
    {
        using var request = Request(HttpMethod.Patch, $"appointments?id=eq.{id}"); request.Content = new StringContent(JsonSerializer.Serialize(new { status }), Encoding.UTF8, "application/json");
        using var response = await _http.SendAsync(request); response.EnsureSuccessStatusCode();
    }
}
