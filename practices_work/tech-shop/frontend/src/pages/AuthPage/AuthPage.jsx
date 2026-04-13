import { useState } from "react";

import "./AuthPage.scss";

function getErrorMessage(error) {
  return error?.response?.data?.error || "Произошла ошибка. Попробуйте еще раз.";
}

export default function AuthPage({ mode, onModeChange, onLogin, onRegister }) {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoginMode = mode === "login";

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await onLogin(loginForm);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      await onRegister(registerForm);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authHero">
        <h1>Tech Shop</h1>
      </div>

      <section className="authCard">
        <div className="authTabs">
          <button
            type="button"
            className={isLoginMode ? "authTab authTab--active" : "authTab"}
            onClick={() => {
              setErrorMessage("");
              onModeChange("login");
            }}
          >
            Вход
          </button>
          <button
            type="button"
            className={!isLoginMode ? "authTab authTab--active" : "authTab"}
            onClick={() => {
              setErrorMessage("");
              onModeChange("register");
            }}
          >
            Регистрация
          </button>
        </div>

        {isLoginMode ? (
          <form className="authForm" onSubmit={handleLoginSubmit}>
            <label className="authField">
              Email
              <input
                className="authInput"
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="ivan@example.com"
                required
              />
            </label>

            <label className="authField">
              Пароль
              <input
                className="authInput"
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Введите пароль"
                required
              />
            </label>

            {errorMessage ? <div className="authError">{errorMessage}</div> : null}

            <button className="authSubmit" type="submit" disabled={submitting}>
              {submitting ? "Выполняется вход..." : "Войти"}
            </button>
          </form>
        ) : (
          <form className="authForm" onSubmit={handleRegisterSubmit}>
            <label className="authField">
              Email
              <input
                className="authInput"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="ivan@example.com"
                required
              />
            </label>

            <label className="authField">
              Имя
              <input
                className="authInput"
                value={registerForm.first_name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, first_name: event.target.value }))
                }
                placeholder="Иван"
                required
              />
            </label>

            <label className="authField">
              Фамилия
              <input
                className="authInput"
                value={registerForm.last_name}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, last_name: event.target.value }))
                }
                placeholder="Иванов"
                required
              />
            </label>

            <label className="authField">
              Пароль
              <input
                className="authInput"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Минимум 6 символов"
                required
              />
            </label>

            {errorMessage ? <div className="authError">{errorMessage}</div> : null}

            <button className="authSubmit" type="submit" disabled={submitting}>
              {submitting ? "Создаем аккаунт..." : "Зарегистрироваться"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
