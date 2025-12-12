import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  CircularProgress, 
  Alert, 
  TextField 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { movieAPI } from "../services/api";
import { Movie } from "../types/api.types";

const MoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieAPI.getAll();
      
      // Логируем ответ для отладки
      console.log("Ответ от API:", response.data);
      
      // Получаем массив фильмов из разных форматов ответа
      let moviesArray: Movie[] = [];
      
      if (response.data && typeof response.data === 'object') {
        // Вариант 1: { success: true, movies: [...] }
        if (response.data.movies && Array.isArray(response.data.movies)) {
          moviesArray = response.data.movies;
        }
        // Вариант 2: { data: [...] }
        else if (response.data.data && Array.isArray(response.data.data)) {
          moviesArray = response.data.data;
        }
        // Вариант 3: response.data уже массив
        else if (Array.isArray(response.data)) {
          moviesArray = response.data;
        }
      }
      
      console.log("Извлеченные фильмы:", moviesArray);
      setMovies(moviesArray);
      
      if (moviesArray.length === 0) {
        console.warn("Фильмы не найдены или API вернул пустой массив");
      }
      
    } catch (err: any) {
      console.error("Ошибка при загрузке фильмов:", err);
      setError("Не удалось загрузить фильмы");
      setMovies([]); // Устанавливаем пустой массив при ошибке
    } finally {
      setLoading(false);
    }
  };

  // Безопасный фильтр с проверкой
  const filteredMovies = Array.isArray(movies) 
    ? movies.filter(movie => {
        if (!movie || typeof movie !== 'object') return false;
        
        const title = movie.title ? String(movie.title).toLowerCase() : '';
        const genre = movie.genre ? String(movie.genre).toLowerCase() : '';
        const search = searchTerm.toLowerCase();
        
        return title.includes(search) || genre.includes(search);
      })
    : [];

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
          Фильмы
        </Typography>
        <TextField 
          fullWidth 
          label="Поиск фильмов" 
          variant="outlined" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          sx={{ mb: 3 }} 
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredMovies.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          {movies.length === 0 ? "Фильмы не найдены" : "Нет фильмов по вашему запросу"}
        </Typography>
      ) : (
        <Box sx={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: 3, 
          justifyContent: { xs: "center", md: "flex-start" } 
        }}>
          {filteredMovies.map((movie) => (
            <Box 
              key={movie.id || Math.random()} 
              sx={{ 
                width: { 
                  xs: "100%", 
                  sm: "calc(50% - 12px)", 
                  md: "calc(33.333% - 16px)" 
                } 
              }}
            >
              <Card sx={{ height: "100%" }}>
                {movie.posterUrl ? (
                  <CardMedia 
                    component="img" 
                    height="300" 
                    image={movie.posterUrl} 
                    alt={movie.title || "Фильм без названия"} 
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 300, 
                      bgcolor: "grey.200", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}
                  >
                    <Typography color="textSecondary">
                      Нет постера
                    </Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {movie.title || "Без названия"}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {movie.genre || "Жанр не указан"} • {movie.duration || "?"} мин.
                    {movie.ageRating && ` • ${movie.ageRating}+`}
                  </Typography>
                  {movie.description && (
                    <Typography variant="body2" color="textSecondary">
                      {movie.description.length > 100 
                        ? `${movie.description.substring(0, 100)}...` 
                        : movie.description}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => navigate(`/sessions?movie=${movie.id}`)}
                  >
                    Сеансы
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
      
      {/* Кнопка для отладки */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button 
          variant="outlined" 
          onClick={fetchMovies}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Обновить список фильмов"}
        </Button>
      </Box>
    </Container>
  );
};

export default MoviesPage;