using AgendaApp.Services;
using AgendaApp.Views;

namespace AgendaApp;

public partial class MainWindow : Window
{
    private readonly SupabaseClient _client = new();
    public MainWindow() { InitializeComponent(); Show(new CustomerDashboard(_client)); }
    private void Show(UserControl view) => PageHost.Content = view;
    private void CustomerDashboard_Click(object sender, RoutedEventArgs e) => Show(new CustomerDashboard(_client));
    private void AdminDashboard_Click(object sender, RoutedEventArgs e) => Show(new AdminDashboard(_client));
    private void AgendaView_Click(object sender, RoutedEventArgs e) => Show(new AgendaView(_client));
    private void AgendaEdit_Click(object sender, RoutedEventArgs e) => Show(new AgendaEdit(_client));
    private void Services_Click(object sender, RoutedEventArgs e) => Show(new ServicesList(_client));
    private void Reviews_Click(object sender, RoutedEventArgs e) => Show(new Reviews());
    private void Contact_Click(object sender, RoutedEventArgs e) => Show(new ContactForm());
}
