import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { authAPI } from '../services/api';
import { LoginRequest } from '../types/api.types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, role } = response.data;
      
      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', formData.email);
      
      // Перенаправляем в зависимости от роли
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при входе. Проверьте email и пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Вход в систему
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Войдите в свой аккаунт для бронирования билетов
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Пароль"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
            variant="outlined"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Нет аккаунта?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/register')}
                sx={{ textDecoration: 'none' }}
              >
                Зарегистрироваться
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>

      {/* Тестовые данные */}
      <Box sx={{ mt: 4, textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Тестовые учетные записи:
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Администратор: <strong>admin@cinema.com</strong> / <strong>admin123</strong>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Пользователь: <strong>user@cinema.com</strong> / <strong>user123</strong>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;