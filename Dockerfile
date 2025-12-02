# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["DotnetStore.sln", "./"]
COPY ["API/API.csproj", "API/"]

# Restore dependencies
RUN dotnet restore "API/API.csproj"

# Copy the rest of the source code
COPY . .

# Build and publish the application
WORKDIR "/src/API"
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Expose port (Render uses PORT env variable)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Set production environment
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "API.dll"]
