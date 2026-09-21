# Linux-based cross-build for a Windows WPF executable.
# MinGW-w64 targets native C/C++; WPF is C#/.NET and must be compiled with the .NET SDK.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/AgendaApp/AgendaApp.csproj src/AgendaApp/
RUN dotnet restore src/AgendaApp/AgendaApp.csproj -p:EnableWindowsTargeting=true

COPY src/AgendaApp/ src/AgendaApp/
RUN dotnet publish src/AgendaApp/AgendaApp.csproj \
    --configuration Release \
    --runtime win-x64 \
    --self-contained true \
    -p:EnableWindowsTargeting=true \
    --output /out

# Export this stage with: docker build --output type=local,dest=artifacts/linux-cross .
# It contains AgendaApp.exe and its required .NET/WPF files.
FROM scratch AS artifact
COPY --from=build /out/ /
