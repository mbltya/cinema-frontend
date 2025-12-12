import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Button
} from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Получаем пользователя из localStorage
    const loadUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('👤 Загружен пользователь:', parsedUser);
        } catch (error) {
          console.error('Ошибка при загрузке пользователя:', error);
        }
      } else {
        console.log('⚠️ Пользователь не найден в localStorage');
      }
    };

    loadUser();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);

      // Получаем пользователя еще раз для свежих данных
      const savedUser = localStorage.getItem('user');
      const currentUser = savedUser ? JSON.parse(savedUser) : null;
      const userId = currentUser?.id || 1;

      console.log(`📋 Запрос заказов для пользователя ID: ${userId}`);

      const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);

      console.log('Ответ API заказов:', response.data);

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError("Не удалось загрузить историю заказов");
      }
    } catch (err: any) {
      console.error("Ошибка загрузки заказов:", err);
      setError("Ошибка при загрузке истории заказов");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLoginTest = () => {
    // Тестовый пользователь для демонстрации
    const testUser = {
      id: 1,
      name: "Иван Иванов",
      email: "ivan@example.com",
      username: "ivanov",
      role: "USER"
    };

    localStorage.setItem('user', JSON.stringify(testUser));
    setUser(testUser);
    alert('Тестовый пользователь установлен: Иван Иванов');
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Подтвержден';
      case 'pending':
        return 'Ожидает';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const formatPrice = (price: any) => {
    const num = Number(price);
    return isNaN(num) ? "—" : `${num.toFixed(2)} BYN`;
  };

  // Данные пользователя
  const currentUser = user || {
    id: 1,
    name: "Тестовый Пользователь",
    email: "test@example.com",
    username: "testuser",
    role: "USER"
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Информация о пользователе */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}
            >
              {currentUser.name?.charAt(0) || currentUser.username?.charAt(0) || "П"}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {currentUser.name || currentUser.username || "Пользователь"}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {currentUser.email || "email@example.com"}
                  </Typography>
                </Box>
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  onClick={handleLoginTest}
                >
                  Тестовый вход
                </Button>
              </Box>

              <Chip
                label={currentUser.role === "ADMIN" ? "Администратор" : "Пользователь"}
                color={currentUser.role === "ADMIN" ? "secondary" : "primary"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ConfirmationNumberIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Всего заказов
                </Typography>
                <Typography variant="h6">{orders.length}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EventIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Дата регистрации
                </Typography>
                <Typography variant="h6">
                  {new Date().toLocaleDateString("ru-RU")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* История заказов */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
            <EventIcon sx={{ mr: 1 }} />
            История заказов
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchOrders}
            disabled={loadingOrders}
          >
            Обновить
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loadingOrders ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Alert severity="info">
            У вас еще нет заказов. Забронируйте билеты в разделе "Сеансы".
          </Alert>
        ) : (
          <List sx={{ width: "100%" }}>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={order.posterUrl}
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {order.posterUrl ? null : <MovieIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="div">
                          {order.movieTitle || "Фильм"}
                        </Typography>
                        <Chip
                          label={getStatusText(order.status)}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Box sx={{ mt: 1 }}>
                          <Typography component="div" variant="body2" color="text.primary">
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                              <EventIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                              {formatDate(order.sessionTime || order.createdAt)}
                            </Box>
                          </Typography>

                          <Typography component="div" variant="body2" color="text.primary">
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                              <PlaceIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                              Места: {Array.isArray(order.seats) ? order.seats.join(", ") : order.seats}
                            </Box>
                          </Typography>

                          <Typography component="div" variant="body2" color="text.primary">
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <ConfirmationNumberIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                Заказ #{order.id}
                              </Box>
                              <Typography variant="h6" color="primary">
                                {formatPrice(order.totalPrice)}
                              </Typography>
                            </Box>
                          </Typography>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Статистика */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Статистика
        </Typography>
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего потрачено
              </Typography>
              <Typography variant="h4">
                {orders.reduce((sum, order) =>
                  sum + (Number(order.totalPrice) || 0), 0
                ).toFixed(2)} BYN
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Всего билетов
              </Typography>
              <Typography variant="h4">
                {orders.reduce((sum, order) =>
                  sum + (Array.isArray(order.seats) ? order.seats.length :
                        (typeof order.seats === 'string' ? 1 : 0)), 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;