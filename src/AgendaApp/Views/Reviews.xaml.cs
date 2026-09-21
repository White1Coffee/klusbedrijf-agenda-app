namespace AgendaApp.Views;
public partial class Reviews : UserControl
{
    public Reviews()
    {
        InitializeComponent();
        ReviewList.ItemsSource = new[] { new { Title = "★★★★★ — Marieke", Text = "Heldere communicatie en de klus netjes uitgevoerd." }, new { Title = "★★★★★ — Samir", Text = "Op tijd aanwezig en goed advies gekregen." } };
    }
}
