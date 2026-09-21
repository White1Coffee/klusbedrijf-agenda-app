namespace AgendaApp.Views;
public partial class ContactForm : UserControl
{
    public ContactForm() => InitializeComponent();
    private void Send_Click(object sender, RoutedEventArgs e)
    {
        ResultText.Text = string.IsNullOrWhiteSpace(NameBox.Text) || string.IsNullOrWhiteSpace(EmailBox.Text) || string.IsNullOrWhiteSpace(MessageBox.Text)
            ? "Vul naam, e-mail en bericht in." : "Bedankt. Uw bericht is ontvangen; databaseopslag wordt in een volgende stap gekoppeld.";
    }
}
