# Klusbedrijf Agenda App

Windows WPF-app voor klanten en beheerders van een klusbedrijf. De app leest afspraken en diensten via de Supabase REST API.

## Starten

1. Installeer de .NET 8 SDK en open `src/AgendaApp/AgendaApp.csproj` in Visual Studio.
2. Stel `SUPABASE_URL` en `SUPABASE_KEY` in als gebruikers- of procesomgevingsvariabelen (zie `config/env.example`).
3. Voer `db/schema.sql` uit in de Supabase SQL Editor.
4. Build en start met de Release-configuratie.

Voor een self-contained Release-publicatie:

```powershell
dotnet publish .\src\AgendaApp\AgendaApp.csproj -c Release -r win-x64 --self-contained true
```

De uitvoer staat in `src/AgendaApp/bin/Release/net8.0-windows/win-x64/publish/`.

## Linux Docker cross-build naar Windows `.exe`

De `Dockerfile` gebruikt een Linux .NET SDK-container en publiceert naar `win-x64`; de uitvoer blijft dus een Windows-app. Een WPF-programma kan niet in een Linux-container worden uitgevoerd, alleen erin worden gecompileerd.

```powershell
docker build --output type=local,dest=artifacts/linux-cross .
```

Daarna staat `AgendaApp.exe` in `artifacts/linux-cross`. Start deze op Windows, rechtstreeks of met:

```powershell
$env:SUPABASE_URL="https://jouw-project.supabase.co"
$env:SUPABASE_KEY="jouw-anon-key"
.\artifacts\linux-cross\AgendaApp.exe
```

De app blijft bruikbaar zonder configuratie; er verschijnt dan een duidelijke verbindingsmelding.

> Een WPF-GUI kan niet zinvol interactief in een Nano Server-container draaien. Het Dockerfile is daarom alleen een publicatie-/startbasis; voor dagelijks desktopgebruik wordt de `.exe` rechtstreeks op Windows gestart.
