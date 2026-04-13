import { useEffect, useState } from "react";

import { api, clearStoredTokens, hasStoredAccessToken, storeTokens } from "./api";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      if (!hasStoredAccessToken()) {
        if (isMounted) {
          setBootstrapping(false);
        }
        return;
      }

      try {
        const user = await api.getMe();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        clearStoredTokens();
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async ({ email, password }) => {
    const tokens = await api.login({ email, password });
    storeTokens(tokens);

    const user = await api.getMe();
    setCurrentUser(user);
  };

  const handleRegister = async ({ email, first_name, last_name, password }) => {
    await api.register({ email, first_name, last_name, password });
    await handleLogin({ email, password });
  };

  const handleLogout = () => {
    clearStoredTokens();
    setCurrentUser(null);
    setAuthMode("login");
  };

  if (bootstrapping) {
    return <div className="appLoading">Загрузка приложения...</div>;
  }

  if (!currentUser) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return <ProductsPage currentUser={currentUser} onLogout={handleLogout} />;
}
