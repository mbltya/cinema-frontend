import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CardActions, Button, CircularProgress, Alert, Chip } from "@mui/material";
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
      
      setSessions(response.data);
    } catch (err: any) {
      setError("Не удалось загрузить сеансы");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ru-RU", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
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
      <Box sx={{ mb: 4 }}><Typography variant="h4" component="h1" gutterBottom>{movieId ? "Сеансы фильма" : "Ближайшие сеансы"}</Typography></Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {sessions.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">Сеансы не найдены</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h6">{session.movieTitle}</Typography>
                  <Chip label={session.format} color="primary" size="small" />
                </Box>
                
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}><AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} /><Typography>{formatDateTime(session.startTime)}</Typography></Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}><LocationOnIcon sx={{ mr: 1, color: "text.secondary" }} /><Typography>{session.cinemaName || "Кинотеатр"} • {session.hallName}</Typography></Box>
                  </Box>
                  
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <ConfirmationNumberIcon sx={{ mr: 1, color: "text.secondary" }} />
                    <Typography variant="h6" color="primary">{session.price.toFixed(2)} руб.</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" onClick={() => navigate(`/booking/${session.id}`)}>Забронировать</Button>
                <Button size="small" onClick={() => navigate("/movies")}>Все фильмы</Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default SessionsPage;