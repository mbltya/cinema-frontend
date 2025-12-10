import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Герой-секция */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 2,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в Кинотеатр!
        </Typography>
        <Typography variant="h5" paragraph>
          Бронируйте билеты онлайн легко и быстро
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate('/movies')}
          sx={{ mt: 2 }}
        >
          Смотреть фильмы
        </Button>
      </Box>

      {/* Преимущества БЕЗ GRID */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4, 
        mb: 6 
      }}>
        <Paper sx={{ p: 3, textAlign: 'center', flex: 1 }}>
          <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Большой выбор фильмов
          </Typography>
          <Typography>
            От блокбастеров до артхауса — выбирайте то, что по душе
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center', flex: 1 }}>
          <TheatersIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Удобные залы
          </Typography>
          <Typography>
            Комфортные кресла, современное оборудование, отличный звук
          </Typography>
        </Paper>
        
        <Paper sx={{ p: 3, textAlign: 'center', flex: 1 }}>
          <ConfirmationNumberIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Легкое бронирование
          </Typography>
          <Typography>
            Выбирайте места онлайн и получайте билеты на email
          </Typography>
        </Paper>
      </Box>

      {/* Призыв к действию */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Готовы к просмотру?
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Выберите фильм, забронируйте билет и наслаждайтесь кино!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/sessions')}
          sx={{ mr: 2 }}
        >
          Посмотреть сеансы
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
        >
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;