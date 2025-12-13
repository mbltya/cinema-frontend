// components/layout/Layout.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ При первом рендере проверяем localStorage
  React.useEffect(() => {
    console.log('Layout: user from AuthContext:', user);
    console.log('Layout: token in localStorage:', localStorage.getItem('token'));
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <LocalMoviesIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Кинотеатр
            </RouterLink>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/movies"
            >
              Фильмы
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/sessions"
            >
              Сеансы
            </Button>

            {/* ✅ user будет null при первом заходе */}
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                >
                  Профиль
                </Button>

                {user.role === 'ADMIN' && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/admin"
                  >
                    Админ-панель
                  </Button>
                )}

                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                >
                  Вход
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                >
                  Регистрация
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;