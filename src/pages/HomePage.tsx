// pages/HomePage.tsx
import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MovieIcon from '@mui/icons-material/Movie';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      {/* Герой-секция */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6,
        }}
      >
        <LocalMoviesIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в Кинотеатр
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Бронируйте билеты онлайн на лучшие фильмы
        </Typography>

        {!user ? (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: '#1976d2',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Зарегистрироваться
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: '#f5f5f5', color: '#f5f5f5' }
              }}
            >
              Войти
            </Button>
          </Box>
        ) : (
          <Button
            component={RouterLink}
            to="/movies"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#1976d2',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
          >
            Смотреть фильмы
          </Button>
        )}
      </Box>

      {/* Особенности */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Почему выбирают нас
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <MovieIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Большой выбор фильмов
              </Typography>
              <Typography>
                Более 100 фильмов в прокате, от новых релизов до классики
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Удобное бронирование
              </Typography>
              <Typography>
                Выбирайте места онлайн и получайте билеты на email
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <LocalMoviesIcon sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Современные залы
              </Typography>
              <Typography>
                Комфортные кресла, отличный звук и качественное изображение
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Призыв к действию */}
      {!user && (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Присоединяйтесь к нашему киносообществу
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Зарегистрируйтесь, чтобы бронировать билеты, получать скидки и следить за новинками
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
          >
            Создать аккаунт
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default HomePage;