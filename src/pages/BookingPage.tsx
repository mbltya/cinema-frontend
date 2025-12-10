import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Бронирование билета
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Сеанс #{sessionId}
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Страница бронирования в разработке
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Здесь будет выбор мест, форма оплаты и подтверждение
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/sessions')}
        >
          Вернуться к сеансам
        </Button>
      </Box>
    </Container>
  );
};

export default BookingPage;