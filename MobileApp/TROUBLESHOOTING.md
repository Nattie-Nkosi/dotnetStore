# Mobile App Troubleshooting Guide

## Products Not Loading

If you're not seeing products in the mobile app, follow these steps:

### 1. Verify API is Running

```bash
cd API
dotnet watch run
```

Verify you see:
```
Now listening on: https://localhost:5001
```

Test the API manually:
```bash
curl -k https://localhost:5001/api/products
```

You should see JSON product data.

### 2. Check Debug Output

When running the mobile app, check the **Debug Output** window in Visual Studio or the console output for messages like:

```
[ProductService] Requesting products from: https://localhost:5001/api/products
[ProductService] Response Status: OK
[ProductService] Received X products
```

If you see errors, they will indicate the problem:
- `Network error`: Can't reach the API
- `SSL error`: Certificate validation issue
- `403/404`: API endpoint or routing issue

### 3. Test API Connectivity from Command Line

```bash
# From Git Bash or PowerShell
curl -k https://localhost:5001/api/products
```

If this works but the app doesn't, it's a mobile app configuration issue.

### 4. Check Firewall Settings

Windows Firewall might be blocking the connection:

1. Open **Windows Defender Firewall**
2. Go to **Advanced settings**
3. Check **Inbound Rules** for your application
4. Ensure port 5001 is allowed

### 5. Try Different API URLs

Edit `MobileApp/MauiProgram.cs` line 28 and try these alternatives:

**Option 1: 127.0.0.1**
```csharp
client.BaseAddress = new Uri("https://127.0.0.1:5001/api/");
```

**Option 2: Your machine's IP address**
```csharp
// First, find your IP address
// Run: ipconfig
// Look for IPv4 Address (e.g., 192.168.1.100)
client.BaseAddress = new Uri("https://192.168.1.100:5001/api/");
```

**Note**: If using an IP address, you need to configure the API to listen on all interfaces:

In `API/Properties/launchSettings.json`, update:
```json
"applicationUrl": "https://0.0.0.0:5001;http://0.0.0.0:5000"
```

Or run:
```bash
dotnet run --urls "https://0.0.0.0:5001"
```

### 6. Disable SSL Validation (Development Only)

This is already configured, but if you're still having SSL issues, verify in `MauiProgram.cs`:

```csharp
handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true;
```

### 7. Check for Error Dialogs

The app now shows error dialogs when it can't load products. Look for:
- "No Products" dialog
- "Error" dialog with details

### 8. Rebuild and Run

```bash
cd MobileApp
dotnet clean
dotnet build -f net9.0-windows10.0.19041.0
dotnet run -f net9.0-windows10.0.19041.0
```

### 9. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Connection refused" | API not running or wrong port |
| "No route to host" | Firewall blocking or wrong IP |
| "SSL handshake failed" | Certificate validation issue |
| "Timeout" | API taking too long or not responding |
| Products show in browser but not app | CORS issue (shouldn't affect mobile apps) or network config |

### 10. Verify App Configuration

Check `MobileApp/MauiProgram.cs` line 28:
```csharp
#if WINDOWS
    client.BaseAddress = new Uri("https://localhost:5001/api/");
```

Make sure this URL is correct for your setup.

## Still Not Working?

1. **Check Visual Studio Output Window**
   - View > Output
   - Show output from: Debug
   - Look for [ProductService] messages

2. **Use Postman or Insomnia**
   - Test `GET https://localhost:5001/api/products`
   - If this fails, the API has an issue

3. **Check API Logs**
   - Look at the API console output
   - Check for any errors or exceptions

4. **Simplify**
   - Stop all other development servers
   - Restart Visual Studio
   - Clean and rebuild everything
   - Run API first, then mobile app

## Need More Help?

Open an issue on GitHub with:
- Error messages from Debug Output
- API console output
- Your operating system
- .NET version (`dotnet --version`)
