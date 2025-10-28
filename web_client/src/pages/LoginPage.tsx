import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/v1/users/login', {
        email,
        password,
      });
      const token = response.data.data.token;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      setMessage('Login successful. Token stored in local storage.');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Login failed');
      } else {
        setError('Unexpected error');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pb: 6 }}>
      <Paper
        className="glass-panel"
        sx={{
          maxWidth: 520,
          width: '100%',
          p: { xs: 4, md: 6 },
          backdropFilter: 'blur(16px)',
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.16em', fontWeight: 600 }}>
              Добро пожаловать
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
              Войдите в панель управления
            </Typography>
            <Typography className="muted-text" sx={{ mt: 1.5 }}>
              Используйте корпоративный аккаунт для мониторинга проектов, ресурсов и статуса заказов.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} display="grid" gap={2.5}>
            <TextField
              label="Корпоративный email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Пароль"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="body2" className="muted-text">
                Забыли пароль? Свяжитесь с администратором проекта
              </Typography>
              <Button type="submit" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>Войти</Button>
            </Stack>
          </Box>
          <Divider flexItem>
            <Typography variant="caption" className="muted-text">
              или
            </Typography>
          </Divider>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="outlined" fullWidth sx={{ borderRadius: 14 }}>Войти через SSO</Button>
            <Button variant="outlined" color="secondary" fullWidth sx={{ borderRadius: 14 }}>Запросить доступ</Button>
          </Stack>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
