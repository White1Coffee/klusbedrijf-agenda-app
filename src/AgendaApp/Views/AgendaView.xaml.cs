using AgendaApp.Services;
namespace AgendaApp.Views;
public partial class AgendaView : UserControl { private readonly SupabaseClient _client; public AgendaView(SupabaseClient client) { _client=client; InitializeComponent(); Loaded += async (_,_) => await LoadAsync(); } private async Task LoadAsync() { StatusText.Text=_client.ConfigurationMessage; if (!_client.IsConfigured) return; try { Appointments.ItemsSource=await _client.GetAppointmentsAsync(); } catch(Exception ex) { StatusText.Text=$"Kon agenda niet laden: {ex.Message}"; } } }
