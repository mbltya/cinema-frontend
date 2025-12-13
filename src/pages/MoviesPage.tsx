// pages/MoviesPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Movie {
  _id: string;
  title: string;
  description: string;
  year: number;
  genre: string[];
  duration: number;
  director: string;
  poster: string;
  rating: number;
}

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/movies');

      if (Array.isArray(response.data)) {
        console.log('Загружено фильмов:', response.data.length);
        setMovies(response.data);
        setFilteredMovies(response.data);
      } else {
        throw new Error('Некорректный формат данных');
      }
    } catch (error: any) {
      console.error('Ошибка при загрузке фильмов:', error);
      setError(error.response?.data?.error || 'Не удалось загрузить фильмы');
      setMovies([]);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Фильмы
      </Typography>

      <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск фильмов по названию, жанру, режиссеру..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {filteredMovies.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? 'Фильмы по вашему запросу не найдены' : 'Фильмы отсутствуют'}
        </Alert>
      ) : (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}>
          {filteredMovies.map((movie) => (
            <Box key={movie._id} sx={{
              width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 16px)' },
              maxWidth: 300
            }}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={movie.poster || 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title} ({movie.year})
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2
                  }}>
                    {movie.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Жанр:</strong> {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Режиссер:</strong> {movie.director}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Длительность:</strong> {movie.duration} мин.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Рейтинг:</strong> {movie.rating}/10
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={`/sessions?movie=${movie._id}`}
                    variant="contained"
                    fullWidth
                  >
                    Выбрать сеанс
                  </Button>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default MoviesPage;