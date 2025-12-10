import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Card, CardContent, CardMedia, CardActions, Button, CircularProgress, Alert, TextField } from "@mui/material";
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
      setMovies(response.data);
    } catch (err: any) {
      setError("Не удалось загрузить фильмы");
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Typography variant="h4" component="h1" gutterBottom>Фильмы</Typography>
        <TextField fullWidth label="Поиск фильмов" variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }} />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {filteredMovies.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">Фильмы не найдены</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: { xs: "center", md: "flex-start" } }}>
          {filteredMovies.map((movie) => (
            <Box key={movie.id} sx={{ width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" } }}>
              <Card sx={{ height: "100%" }}>
                {movie.posterUrl ? (
                  <CardMedia component="img" height="300" image={movie.posterUrl} alt={movie.title} />
                ) : (
                  <Box sx={{ height: 300, bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography color="textSecondary">Нет постера</Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>{movie.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>{movie.genre} • {movie.duration} мин.{movie.ageRating && ` • ${movie.ageRating}+`}</Typography>
                  {movie.description && <Typography variant="body2" color="textSecondary">{movie.description.length > 100 ? `${movie.description.substring(0, 100)}...` : movie.description}</Typography>}
                </CardContent>
                <CardActions><Button size="small" color="primary" onClick={() => navigate(`/sessions?movie=${movie.id}`)}>Сеансы</Button></CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MoviesPage;