namespace MobileApp;

public static class AppSettings
{
    public static string ApiBaseUrl
    {
        get
        {
#if WINDOWS
            return "https://localhost:5001/api/";
#elif ANDROID
            return "https://10.0.2.2:5001/api/";
#elif IOS
            return "https://localhost:5001/api/";
#else
            return "https://localhost:5001/api/";
#endif
        }
    }

    public static string ImageBaseUrl
    {
        get
        {
            // Images are served from the React client's public folder
#if WINDOWS
            return "https://localhost:3000";
#elif ANDROID
            return "https://10.0.2.2:3000";
#elif IOS
            return "https://localhost:3000";
#else
            return "https://localhost:3000";
#endif
        }
    }
}
