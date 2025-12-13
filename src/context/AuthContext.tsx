// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  joinDate?: string;
  bookingsCount?: number;
  totalSpent?: number;
  favoriteGenres?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string; user?: User }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Восстанавливаем пользователя ТОЛЬКО если есть валидный токен
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Если нет токена - очищаем всё
      if (!token) {
        localStorage.removeItem('user');
        return null;
      }

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      // При ошибке парсинга - очищаем всё
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      console.log('Попытка входа с данными:', { email });

      // Пробуем реальный бэкенд
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      console.log('Бэкенд ответил:', response.status, response.data);

      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        const token = response.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, error: 'Ошибка входа: некорректный ответ сервера' };

    } catch (error: any) {
      console.error('Ошибка при входе:', error);

      // Обрабатываем разные типы ошибок
      if (error.response) {
        // Сервер ответил с ошибкой (400, 401, 500 и т.д.)
        const status = error.response.status;
        const errorMessage = error.response.data?.error ||
                           (status === 401 ? 'Неверный email или пароль' :
                            status === 400 ? 'Некорректные данные' :
                            `Ошибка сервера (${status})`);

        return { success: false, error: errorMessage };

      } else if (error.request) {
        // Запрос был сделан, но ответа нет (сеть, CORS, таймаут)
        console.error('Нет ответа от сервера:', error.message);
        return { success: false, error: 'Сервер недоступен. Проверьте подключение.' };

      } else {
        // Ошибка настройки запроса
        console.error('Ошибка настройки запроса:', error.message);
        return { success: false, error: 'Ошибка при отправке запроса' };
      }

    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
      });

      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        const token = response.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Ошибка регистрации: некорректный ответ сервера' };

    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);

      if (error.response) {
        const errorMessage = error.response.data?.error || 'Ошибка регистрации';
        return { success: false, error: errorMessage };
      } else if (error.request) {
        return { success: false, error: 'Сервер недоступен. Проверьте подключение.' };
      } else {
        return { success: false, error: 'Ошибка при отправке запроса' };
      }

    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setLoading(true);
    try {
      console.log('Обновление профиля:', data);

      const token = localStorage.getItem('token');

      if (!token) {
        return { success: false, error: 'Требуется авторизация' };
      }

      const response = await axios.put(
        'http://localhost:8080/api/profile',
        data,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser as User);
        return { success: true, user: updatedUser as User };
      }

      return { success: false, error: 'Некорректный ответ сервера' };

    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);

      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          // Токен истек или невалиден
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          return { success: false, error: 'Сессия истекла. Войдите заново.' };
        }

        const errorMessage = error.response.data?.error || 'Ошибка обновления профиля';
        return { success: false, error: errorMessage };
      }

      return { success: false, error: 'Ошибка соединения' };

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Очищаем все данные
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('Пользователь вышел из системы');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};