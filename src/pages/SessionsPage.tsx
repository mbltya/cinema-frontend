import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress, 
  Alert, 
  Chip 
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sessionAPI } from "../services/api";
import { Session } from "../types/api.types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movie");
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchSessions();
  }, [movieId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let response;
      
      if (movieId) {
        response = await sessionAPI.getByMovie(parseInt(movieId));
      } else {
        response = await sessionAPI.getUpcoming();
      }
      
      // Логируем для отладки
      console.log("Ответ от API сеансов:", response.data);
      
      // Получаем массив сеансов из разных форматов ответа
      let sessionsArray: Session[] = [];
      
      if (response.data && typeof response.data === 'object') {
        // Вариант 1: { success: true, sessions: [...] }
        if (response.data.sessions && Array.isArray(response.data.sessions)) {
          sessionsArray = response.data.sessions;
        }
        // Вариант 2: { data: [...] }
        else if (response.data.data && Array.isArray(response.data.data)) {
          sessionsArray = response.data.data;
        }
        // Вариант 3: response.data уже массив
        else if (Array.isArray(response.data)) {
          sessionsArray = response.data;
        }
      }
      
      console.log("Извлеченные сеансы:", sessionsArray);
      setSessions(sessionsArray);
      
      if (sessionsArray.length === 0) {
        console.warn("Сеансы не найдены или API вернул пустой массив");
      }
      
    } catch (err: any) {
      console.error("Ошибка при загрузке сеансов:", err);
      setError("Не удалось загрузить сеансы");
      setSessions([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString("ru-RU", { 
        weekday: "short", 
        day: "numeric", 
        month: "long", 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch (error) {
      return "Дата не указана";
    }
  };

  // Безопасный доступ к полям
  const getSessionField = (session: Session, field: keyof Session, defaultValue: any = "") => {
    return session[field] !== undefined ? session[field] : defaultValue;
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {movieId ? "Сеансы фильма" : "Ближайшие сеансы"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          Сеансы не найдены
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sessions.map((session) => (
            <Card key={session.id || Math.random()}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">
                    {getSessionField(session, 'movieTitle', 'Фильм')}
                  </Typography>
                  {session.format && (
                    <Chip label={session.format} color="primary" size="small" />
                  )}
                </Box>
                
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: { xs: "column", md: "row" }, 
                  gap: 2, 
                  mb: 1 
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>
                        {formatDateTime(getSessionField(session, 'startTime', ''))}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography>
                        {getSessionField(session, 'cinemaName', 'Кинотеатр')} • {getSessionField(session, 'hallName', 'Зал')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <ConfirmationNumberIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="h6" color="primary">
                      {Number(getSessionField(session, 'price', 0)).toFixed(2)} руб.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => navigate(`/booking/${getSessionField(session, 'id', '')}`)}
                >
                  Забронировать
                </Button>
                <Button 
                  size="small" 
                  onClick={() => navigate("/movies")}
                >
                  Все фильмы
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
      
      {/* Кнопка для отладки */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button 
          variant="outlined" 
          onClick={fetchSessions}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Обновить список сеансов"}
        </Button>
      </Box>
    </Container>
  );
};

export default SessionsPage;