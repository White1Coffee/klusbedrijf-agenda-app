using AgendaApp.Services;
namespace AgendaApp.Views;
public partial class ServicesList : UserControl
{
    private readonly SupabaseClient _client;
    public ServicesList(SupabaseClient client) { _client = client; InitializeComponent(); Loaded += async (_, _) => await LoadAsync(); }

    private async Task LoadAsync()
    {
        if (!_client.IsConfigured)
        {
            StatusText.Text = "Voorbeeld van onze standaarddiensten. Stel Supabase in voor de actuele lijst.";
            Services.ItemsSource = new[]
            {
                new { Name = "Onderhoud", Description = "Periodiek onderhoud en kleine herstelwerkzaamheden.", PriceIndication = "Vanaf € 65" },
                new { Name = "Reparatie", Description = "Vakkundige reparaties in en om het huis.", PriceIndication = "Op aanvraag" },
                new { Name = "Renovatie", Description = "Renovatie en verbouwing op maat.", PriceIndication = "Op aanvraag" }
            };
            return;
        }
        StatusText.Text = _client.ConfigurationMessage;
        try { Services.ItemsSource = await _client.GetServicesAsync(); }
        catch (Exception ex) { StatusText.Text = $"Kon diensten niet laden: {ex.Message}"; }
    }
}
