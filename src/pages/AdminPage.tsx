import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AdminPage: React.FC = () => {
  // Временные данные для демонстрации
  const recentTickets = [
    { id: 1, movie: 'Интерстеллар', user: 'user@cinema.com', time: '2024-01-15 18:00', status: 'Подтвержден' },
    { id: 2, movie: 'Начало', user: 'admin@cinema.com', time: '2024-01-15 20:00', status: 'Ожидает' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>
      </Box>

      {/* Статистика без Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mb: 4 
      }}>
        {[
          { value: '156', label: 'Билетов продано' },
          { value: '24', label: 'Активных сеансов' },
          { value: '15', label: 'Фильмов в прокате' },
          { value: '2', label: 'Кинотеатра' },
        ].map((stat, index) => (
          <Paper key={index} sx={{ 
            p: 3, 
            textAlign: 'center',
            flex: 1,
            minWidth: { xs: '100%', md: 'auto' }
          }}>
            <Typography variant="h4" color="primary">
              {stat.value}
            </Typography>
            <Typography color="textSecondary">{stat.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Быстрые действия */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Быстрые действия
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Добавить фильм
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Создать сеанс
          </Button>
          <Button variant="outlined">
            Просмотреть отчеты
          </Button>
        </Box>
      </Paper>

      {/* Последние билеты */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Последние бронирования
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Фильм</TableCell>
                <TableCell>Пользователь</TableCell>
                <TableCell>Время</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>{ticket.movie}</TableCell>
                  <TableCell>{ticket.user}</TableCell>
                  <TableCell>{ticket.time}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminPage;