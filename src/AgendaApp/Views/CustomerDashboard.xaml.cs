using AgendaApp.Services;
namespace AgendaApp.Views;
public partial class CustomerDashboard : UserControl
{
    private readonly SupabaseClient _client;
    public CustomerDashboard(SupabaseClient client) { _client = client; InitializeComponent(); Loaded += async (_, _) => await LoadAsync(); }
    private async Task LoadAsync() { StatusText.Text = _client.ConfigurationMessage; if (!_client.IsConfigured) return; try { Appointments.ItemsSource = (await _client.GetAppointmentsAsync()).Take(5); } catch (Exception ex) { StatusText.Text = $"Kon afspraken niet laden: {ex.Message}"; } }
}
