// pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  History,
  ConfirmationNumber,
  Favorite,
  Settings,
  CalendarToday,
  LocationOn,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Мок-данные для разработки
const mockProfile = {
  id: 1,
  username: 'Иван Иванов',
  email: 'ivan@cinema.com',
  role: 'USER',
  joinDate: '15 января 2024',
  bookingsCount: 8,
  totalSpent: 4250,
  favoriteGenres: ['Боевик', 'Драма', 'Комедия'],
};

const mockBookings = [
  {
    id: 1,
    movie: 'Дюна: Часть вторая',
    date: '12.12.2024',
    time: '19:30',
    seats: ['A5', 'A6'],
    price: 1200,
    status: 'Завершено',
    cinema: 'Кинотеатр "Октябрь"',
    hall: 'Зал 3'
  },
  {
    id: 2,
    movie: 'Оппенгеймер',
    date: '05.12.2024',
    time: '21:00',
    seats: ['B3'],
    price: 850,
    status: 'Завершено',
    cinema: 'Кинотеатр "Звезда"',
    hall: 'Зал 1'
  },
  {
    id: 3,
    movie: 'Барби',
    date: '20.12.2024',
    time: '18:15',
    seats: ['C7', 'C8'],
    price: 950,
    status: 'Активен',
    cinema: 'Кинотеатр "Современник"',
    hall: 'Зал 2'
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { user: contextUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(mockProfile);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Используем мок-данные для разработки
  const user = contextUser || mockProfile;
  const profile = mockProfile;
  const bookings = mockBookings;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError('');
      const token = localStorage.getItem('token');

      if (!token) {
        setProfileError('Токен не найден');
        setProfileLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Профиль загружен:', response.data);
    } catch (err: any) {
      console.error('Ошибка загрузки профиля:', err);
      setProfileError(err.response?.data?.error || 'Не удалось загрузить профиль');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Сохранение данных:', editData);
    // Здесь будет вызов API когда бэкенд готов
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profile);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditField = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          Пожалуйста, войдите в систему для просмотра профиля
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          Войти
        </Button>
      </Container>
    );
  }

  if (profileLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Мой профиль
      </Typography>

      {profileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {profileError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Левая колонка - информация профиля */}
        <Box sx={{ width: { xs: '100%', md: '35%' } }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 3, fontSize: '2rem' }}
              >
                {profile.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5">{profile.username}</Typography>
                <Typography color="textSecondary">
                  {profile.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
                </Typography>
                <Chip
                  label={`Участник с ${profile.joinDate}`}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  label="Имя пользователя"
                  value={editData.username}
                  onChange={(e) => handleEditField('username', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleEditField('email', e.target.value)}
                  margin="normal"
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    fullWidth
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    fullWidth
                  >
                    Отмена
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom>Информация</Typography>
                <Typography paragraph><strong>ID:</strong> {profile.id}</Typography>
                <Typography paragraph><strong>Имя пользователя:</strong> {profile.username}</Typography>
                <Typography paragraph><strong>Email:</strong> {profile.email}</Typography>
                <Typography paragraph><strong>Роль:</strong> {profile.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">Статистика</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Box>
                      <Typography variant="h6">{profile.bookingsCount}</Typography>
                      <Typography variant="caption">Бронирований</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6">{profile.totalSpent} ₽</Typography>
                      <Typography variant="caption">Всего потрачено</Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Редактировать профиль
                </Button>
              </Box>
            )}
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Любимые жанры</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {profile.favoriteGenres.map((genre, index) => (
                <Chip key={index} label={genre} color="primary" variant="outlined" />
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Правая колонка - активность */}
        <Box sx={{ width: { xs: '100%', md: '65%' } }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab icon={<History />} label="История бронирований" />
              <Tab icon={<ConfirmationNumber />} label="Мои билеты" />
              <Tab icon={<Settings />} label="Настройки" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>История бронирований</Typography>

              {bookings.length === 0 ? (
                <Alert severity="info">
                  У вас пока нет бронирований
                </Alert>
              ) : (
                <List>
                  {bookings.map((booking) => (
                    <Card key={booking.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6">{booking.movie}</Typography>
                            <Typography color="textSecondary">
                              <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                              {booking.date} •
                              <AccessTime sx={{ fontSize: 14, verticalAlign: 'middle', mx: 0.5 }} />
                              {booking.time}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              <LocationOn sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                              {booking.cinema} • {booking.hall}
                            </Typography>
                            <Typography variant="body2">
                              Места: {booking.seats.join(', ')}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip
                              label={booking.status}
                              color={booking.status === 'Активен' ? 'success' : 'default'}
                              size="small"
                            />
                            <Typography variant="h6" sx={{ mt: 1 }}>
                              {booking.price} ₽
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Alert severity="info">
                Активные билеты появятся здесь после бронирования
              </Alert>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Настройки аккаунта</Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Настройки временно недоступны. Функциональность будет добавлена позже.
              </Alert>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Выйти из аккаунта
              </Button>
            </TabPanel>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;