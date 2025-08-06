// Configure for Google OAuth 2.0
export const googleOAuthConfig = {
  clientId: (import.meta as any).env.VITE_GOOGLE_CLIENT_ID, // BUKAN process.env.NEXT_PUBLIC_CLIENT_ID
  clientSecret: (import.meta as any).env.VITE_GOOGLE_CLIENT_SECRET,
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUri: "https://inflaunch.core.vercel.app/explore",
  scope: "https://www.googleapis.com/auth/youtube.readonly",
  responseType: "code",
};
