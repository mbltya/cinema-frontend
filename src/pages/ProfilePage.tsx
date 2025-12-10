import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { userEmail, userRole, logout } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Мой профиль
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Информация о пользователе
          </Typography>
          <Typography>
            <strong>Email:</strong> {userEmail}
          </Typography>
          <Typography>
            <strong>Роль:</strong> {userRole === 'ADMIN' ? 'Администратор' : 'Пользователь'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary">
            Мои билеты
          </Button>
          <Button variant="outlined" color="secondary" onClick={logout}>
            Выйти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;