import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { sessionAPI } from "../services/api";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ChairIcon from "@mui/icons-material/Chair";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const BookingPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // Состояния
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatMap, setSeatMap] = useState<any[][]>([]);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  // Загрузка данных сеанса
  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getById(parseInt(sessionId || "0"));

      // Извлекаем данные сеанса
      const sessionData = response.data?.session || response.data;
      setSession(sessionData);

      // Создаем тестовую карту мест (10 рядов × 10 мест)
      generateSeatMap();

    } catch (err: any) {
      console.error("Ошибка загрузки сеанса:", err);
      setError("Не удалось загрузить информацию о сеансе");
    } finally {
      setLoading(false);
    }
  };

  // Генерация карты мест
  const generateSeatMap = () => {
    const rows = 10;
    const seatsPerRow = 10;
    const map = [];

    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        // Случайным образом отмечаем некоторые места как занятые
        const isOccupied = Math.random() > 0.8;
        rowSeats.push({
          id: `R${row}S${seat}`,
          row,
          seat,
          occupied: isOccupied,
          selected: false
        });
      }
      map.push(rowSeats);
    }

    setSeatMap(map);
  };

  // Выбор места
  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    const seat = seatMap[rowIndex][seatIndex];

    if (seat.occupied) return; // Нельзя выбрать занятое место

    const seatId = seat.id;
    const newSelectedSeats = [...selectedSeats];
    const seatIndexInSelected = newSelectedSeats.indexOf(seatId);

    if (seatIndexInSelected === -1) {
      // Выбор места
      if (newSelectedSeats.length >= 6) {
        alert("Можно выбрать не более 6 мест");
        return;
      }
      newSelectedSeats.push(seatId);
    } else {
      // Отмена выбора
      newSelectedSeats.splice(seatIndexInSelected, 1);
    }

    setSelectedSeats(newSelectedSeats);

    // Обновляем карту
    const newMap = [...seatMap];
    newMap[rowIndex][seatIndex].selected = !seat.selected;
    setSeatMap(newMap);
  };

  // Удаление места из корзины
  const removeSeat = (seatId: string) => {
    const newSelectedSeats = selectedSeats.filter(id => id !== seatId);
    setSelectedSeats(newSelectedSeats);

    // Сбрасываем выбор на карте
    const newMap = [...seatMap];
    for (let row of newMap) {
      for (let seat of row) {
        if (seat.id === seatId) {
          seat.selected = false;
          break;
        }
      }
    }
    setSeatMap(newMap);
  };

  // Расчет общей суммы
  const calculateTotal = () => {
    if (!session) return 0;
    return selectedSeats.length * (session.price || 3.5);
  };

  // Оформление бронирования
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Выберите хотя бы одно место");
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        userId: 1,
        sessionId: parseInt(sessionId || "0"),
        seats: selectedSeats,
        totalPrice: calculateTotal()
      };

      console.log("📤 Отправка заказа:", bookingData);

      // Пробуем основной эндпоинт
      const response = await axios.post('http://localhost:5000/api/orders', bookingData);

      if (response.data.success) {
        alert(`✅ Бронирование успешно!\n\nНомер заказа: #${response.data.order.id}\nФильм: ${session?.movieTitle}\nМеста: ${selectedSeats.join(", ")}\nСумма: ${calculateTotal()} BYN\n\nЗаказ сохранен в истории.`);

        // Перенаправление на профиль
        navigate("/profile");
      } else {
        throw new Error(response.data.message || "Ошибка сервера");
      }

    } catch (err: any) {
      console.error("❌ Ошибка бронирования:", err);

      // Если основной эндпоинт не работает, пробуем тестовый
      try {
        console.log("Пробуем тестовый эндпоинт...");
        const testResponse = await axios.post('http://localhost:5000/api/orders/test', {
          sessionId: parseInt(sessionId || "0"),
          seats: selectedSeats,
          totalPrice: calculateTotal()
        });

        alert(`⚠️ Тестовое бронирование!\n\nНомер: #${testResponse.data.order.id}\nМеста: ${selectedSeats.join(", ")}\nСумма: ${calculateTotal()} BYN\n\n(Реальный заказ не сохранен в БД)`);
        navigate("/profile");

      } catch (testErr: any) {
        alert(`❌ Ошибка при бронировании: ${err.message || "Попробуйте снова"}`);
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !session) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || "Сеанс не найден"}
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/sessions")}>
          Вернуться к сеансам
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Бронирование билетов
      </Typography>

      {/* Информация о сеансе */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between"
          }}>
            <Box sx={{ flex: 1, mb: { xs: 2, md: 0 } }}>
              <Typography variant="h5" gutterBottom>
                {session.movieTitle || "Фильм"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>
                  {new Date(session.startTime || "").toLocaleString("ru-RU")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography>
                  {session.cinemaName || "Кинотеатр"} • {session.hallName || "Зал"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-end" }
            }}>
              <ConfirmationNumberIcon sx={{ mr: 1, color: "primary.main", fontSize: 40 }} />
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Цена за место
                </Typography>
                <Typography variant="h4" color="primary">
                  {session.price ? `${session.price} BYN` : "3.50 BYN"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 4
      }}>
        {/* Левая колонка: Карта зала */}
        <Box sx={{ flex: { md: 2 } }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Выбор мест в зале
            </Typography>

            {/* Экран */}
            <Box sx={{
              width: "100%",
              height: 40,
              bgcolor: "grey.300",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
              borderRadius: 1
            }}>
              <Typography variant="body2" color="textSecondary">
                ЭКРАН
              </Typography>
            </Box>

            {/* Карта мест */}
            <Box sx={{ mb: 4 }}>
              {seatMap.map((row, rowIndex) => (
                <Box key={`row-${rowIndex}`} sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1
                }}>
                  <Typography variant="body2" sx={{ width: 30, textAlign: "center", mr: 1 }}>
                    {rowIndex + 1}
                  </Typography>
                  {row.map((seat, seatIndex) => (
                    <IconButton
                      key={seat.id}
                      onClick={() => handleSeatClick(rowIndex, seatIndex)}
                      disabled={seat.occupied}
                      sx={{
                        width: 36,
                        height: 36,
                        m: 0.5,
                        bgcolor: seat.occupied
                          ? "error.main"
                          : seat.selected
                            ? "success.main"
                            : "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: seat.occupied
                            ? "error.dark"
                            : seat.selected
                              ? "success.dark"
                              : "primary.dark"
                        }
                      }}
                    >
                      <ChairIcon fontSize="small" />
                    </IconButton>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Легенда */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 20, height: 20, bgcolor: "primary.main", mr: 1 }} />
                <Typography variant="body2">Свободно</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 20, height: 20, bgcolor: "success.main", mr: 1 }} />
                <Typography variant="body2">Выбрано</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 20, height: 20, bgcolor: "error.main", mr: 1 }} />
                <Typography variant="body2">Занято</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Правая колонка: Корзина */}
        <Box sx={{
          flex: { md: 1 },
          minWidth: { md: 300 }
        }}>
          <Paper sx={{
            p: 3,
            position: "sticky",
            top: 20,
            maxHeight: "calc(100vh - 100px)",
            overflow: "auto"
          }}>
            <Typography variant="h6" gutterBottom>
              Ваш заказ
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Выбранные места */}
            {selectedSeats.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                Выберите места на схеме
              </Typography>
            ) : (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Выбранные места ({selectedSeats.length}):
                </Typography>
                <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedSeats.map(seatId => (
                    <Chip
                      key={seatId}
                      label={`Место ${seatId}`}
                      onDelete={() => removeSeat(seatId)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Итог */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Билеты:</Typography>
                    <Typography>{selectedSeats.length} × {session.price || 3.5} BYN</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6">Итого:</Typography>
                    <Typography variant="h6" color="primary">
                      {calculateTotal()} BYN
                    </Typography>
                  </Box>
                </Box>

                {/* Кнопка бронирования */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBooking}
                  disabled={isBooking || selectedSeats.length === 0}
                  sx={{ py: 1.5 }}
                >
                  {isBooking ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                      Оформление...
                    </>
                  ) : (
                    `Забронировать за ${calculateTotal()} BYN`
                  )}
                </Button>

                <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                  После бронирования билеты появятся в вашем профиле
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button onClick={() => navigate("/sessions")}>
          Вернуться к сеансам
        </Button>
      </Box>
    </Container>
  );
};

export default BookingPage;