using AgendaApp.Services;
namespace AgendaApp.Views;
public partial class AdminDashboard : UserControl
{
 private readonly SupabaseClient _client; public AdminDashboard(SupabaseClient client) { _client=client; InitializeComponent(); Loaded += async (_,_) => await LoadAsync(); }
 private async Task LoadAsync() { StatusText.Text=_client.ConfigurationMessage; if (!_client.IsConfigured) return; try { var items=await _client.GetAppointmentsAsync(); Total.Text=items.Count.ToString(); Requested.Text=items.Count(x=>x.Status == "requested").ToString(); } catch(Exception ex) { StatusText.Text=$"Kon overzicht niet laden: {ex.Message}"; } }
}
