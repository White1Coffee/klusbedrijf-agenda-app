# KBM & LW Agenda

Een kleine, offline agenda-app in HTML, CSS en JavaScript. Afspraken worden lokaal in de browser bewaard. Er is geen account, database, externe koppeling of verzending van gegevens.

## Werkt al

- Afspraken maken, bekijken, statussen wijzigen en verwijderen.
- Maandkalender en planningsoverzicht.
- Diensten, klantreacties en een contactbericht dat je zelf kunt kopiëren.
- JSON-back-up maken en terugzetten.
- Offline bruikbaar, zonder externe scripts, lettertypen of webdiensten.

De agenda blijft op het apparaat staan waarop je hem gebruikt. Een browser en een geïnstalleerde Android-app hebben elk hun eigen lokale opslag. Gebruik de back-upfunctie om afspraken over te zetten. Het contactscherm verstuurt niets.

## Openen als website

Open `www/index.html` rechtstreeks in je browser. Voor de PWA-installatie en offline cache kun je de lokale launcher starten met `python start.py`. Die opent de agenda via `127.0.0.1` op deze computer; de app is niet bereikbaar vanaf andere apparaten of internet.

## Windows-EXE maken

Installeer Python op Windows en voer in PowerShell uit:

```powershell
python -m pip install pyinstaller
pyinstaller --noconfirm --clean --onefile --windowed --name KBM-LW-Agenda --add-data "www:www" start.py
```

De losse app staat daarna in `dist/KBM-LW-Agenda.exe`. De webbestanden zitten in de EXE. De launcher gebruikt alleen een lokale loopback-webserver zodat de browser de afspraken en offline app-cache kan bewaren.

## Android-APK maken

Installeer Node.js 22 of hoger en Android Studio 2025.2.1 of hoger met een Android SDK voor API 24 of hoger. Android Studio installeert de bijbehorende JDK. Capacitor gebruikt de webbestanden in `www`. Voer in de projectmap uit:

```powershell
npm install
npm run android:add
npm run android:sync
npm run android:open
```

Bouw daarna de APK in Android Studio via **Build > Build Bundle(s) / APK(s) > Build APK(s)**. Na aanpassingen aan de webapp voer je `npm run android:sync` opnieuw uit. De agenda-app zelf gebruikt geen internetverbinding; npm en Android Studio downloaden alleen de bouwgereedschappen en platformbestanden die voor het maken van de APK nodig zijn.

