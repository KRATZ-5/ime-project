// код AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';


interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Создаем контекст с значениями по умолчанию
const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {}, // Пустая функция для login
  logout: () => {}, // Пустая функция для logout
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    // Этот эффект будет вызван при каждом изменении токена
    localStorage.setItem('token', token || ''); // Сохраняем в localStorage при изменении
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
      });

      if (!response.ok) {
        // Обрабатываем ошибки от сервера (например, неверные учетные данные)
        console.error('Login failed:', response.status, response.statusText);
        // Можно выбросить ошибку, чтобы обработать ее в компоненте
        throw new Error('Login failed');
      }

      const data = await response.json();

      if (data.access && data.refresh) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setToken(data.access);
      } else {
        console.error('Invalid token data received:', data);
        throw new Error('Invalid token data');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Здесь можно отобразить сообщение об ошибке пользователю
      throw error; // Пробрасываем ошибку, чтобы компонент мог ее обработать
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);