using AgendaApp.Models;
using AgendaApp.Services;
namespace AgendaApp.Views;
public partial class AgendaEdit : UserControl
{
 private readonly SupabaseClient _client; public AgendaEdit(SupabaseClient client) { _client=client; InitializeComponent(); DateBox.SelectedDate=DateTime.Today; Loaded += async (_,_) => await LoadAsync(); }
 private async Task LoadAsync() { StatusText.Text=_client.ConfigurationMessage; if (!_client.IsConfigured) return; try { Appointments.ItemsSource=await _client.GetAppointmentsAsync(); } catch(Exception ex) { StatusText.Text=$"Kon afspraken niet laden: {ex.Message}"; } }
 private async void Refresh_Click(object sender, RoutedEventArgs e) => await LoadAsync();
 private async void Create_Click(object sender, RoutedEventArgs e) { if (!Guid.TryParse(CustomerIdBox.Text, out var customerId) || string.IsNullOrWhiteSpace(TitleBox.Text) || DateBox.SelectedDate is null || !TimeSpan.TryParse(StartBox.Text, out var start) || !TimeSpan.TryParse(EndBox.Text, out var end)) { StatusText.Text="Vul een geldig klant-ID, titel, datum en tijden in."; return; } var day=DateBox.SelectedDate.Value; var appointment=new Appointment { CustomerId=customerId, Title=TitleBox.Text.Trim(), StartTime=day.Add(start), EndTime=day.Add(end), Notes=NotesBox.Text.Trim() }; if (appointment.EndTime <= appointment.StartTime) { StatusText.Text="De eindtijd moet na de starttijd liggen."; return; } try { await _client.CreateAppointmentAsync(appointment); StatusText.Text="Afspraak toegevoegd."; await LoadAsync(); } catch(Exception ex) { StatusText.Text=$"Opslaan mislukt: {ex.Message}"; } }
 private async void UpdateStatus_Click(object sender, RoutedEventArgs e) { if (Appointments.SelectedItem is not Appointment appointment || sender is not Button button || button.Tag is not string status) { StatusText.Text="Selecteer eerst een afspraak."; return; } try { await _client.UpdateAppointmentStatusAsync(appointment.Id, status); StatusText.Text="Status gewijzigd."; await LoadAsync(); } catch(Exception ex) { StatusText.Text=$"Wijzigen mislukt: {ex.Message}"; } }
}
