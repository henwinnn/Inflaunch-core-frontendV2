import { useState, useEffect } from "react";
import axios from "axios";

interface OAuth2Config {
  clientId: string;
  clientSecret?: string; // Required for some flows like authorization_code
  authorizationUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scope: string;
  responseType?: string; // e.g., 'code', 'token'
  extraAuthParams?: Record<string, string>;
  extraTokenParams?: Record<string, string>;
}

interface AuthState {
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  error: string | null;
  isLoading: boolean;
}

const useOAuth2 = (config: OAuth2Config) => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken:
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null,
    idToken:
      typeof window !== "undefined" ? localStorage.getItem("idToken") : null,
    refreshToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null,
    expiresIn:
      typeof window !== "undefined"
        ? Number(localStorage.getItem("expiresIn") || "0")
        : null,
    error: null,
    isLoading: false,
  });

  const initiateAuthFlow = () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: config.responseType || "code", // 'code' for Authorization Code flow
      scope: config.scope,
      ...config.extraAuthParams,
    });
    if (typeof window !== "undefined") {
      window.location.href = `${config.authorizationUrl}?${params.toString()}`;
    }
  };

  const handleRedirectCallback = async (authorizationCode?: string) => {
    if (!authorizationCode) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error) {
        setAuthState((prev) => ({ ...prev, error: error, isLoading: false }));
        if (typeof window !== "undefined") {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          ); // Clean URL
        }
        return;
      }

      if (!code) {
        setAuthState((prev) => ({
          ...prev,
          error: "No authorization code found in URL.",
          isLoading: false,
        }));
        if (typeof window !== "undefined") {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          ); // Clean URL
        }
        return;
      }
      authorizationCode = code;
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const tokenRequestBody: Record<string, string> = {
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        ...config.extraTokenParams,
      };

      if (config.clientSecret) {
        tokenRequestBody.client_secret = config.clientSecret;
      }

      const response = await axios.post(
        config.tokenUrl,
        new URLSearchParams(tokenRequestBody),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, id_token, refresh_token, expires_in } =
        response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", access_token);
        if (id_token) localStorage.setItem("idToken", id_token);
        if (refresh_token) localStorage.setItem("refreshToken", refresh_token);
        if (expires_in)
          localStorage.setItem("expiresIn", expires_in.toString());
      }

      setAuthState({
        accessToken: access_token,
        idToken: id_token || null,
        refreshToken: refresh_token || null,
        expiresIn: expires_in || null,
        error: null,
        isLoading: false,
      });
      if (typeof window !== "undefined") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        ); // Clean URL
      }
    } catch (err: any) {
      console.error("Token exchange error:", err);
      const errorMessage =
        err?.response?.data?.error_description ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to exchange token.";
      setAuthState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        accessToken: null,
        idToken: null,
        refreshToken: null,
        expiresIn: null,
      }));
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        ); // Clean URL
      }
    }
  };

  const logout = () => {
    setAuthState({
      accessToken: null,
      idToken: null,
      refreshToken: null,
      expiresIn: null,
      error: null,
      isLoading: false,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresIn");
    }
    // Optionally, redirect to a logout endpoint of the OAuth provider
    // if (config.logoutUrl) {
    //   window.location.href = config.logoutUrl;
    // }
  };

  // Effect to handle the redirect when the component mounts and there's a code in the URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.has("code") &&
        !authState.accessToken &&
        !authState.isLoading
      ) {
        handleRedirectCallback();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount if there's a code

  return {
    ...authState,
    initiateAuthFlow,
    handleRedirectCallback,
    logout,
  };
};

export default useOAuth2;
