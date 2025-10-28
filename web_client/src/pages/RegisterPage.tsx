import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      px: 2.5,
      py: 2,
      borderRadius: 20,
      border: '1px solid rgba(99, 102, 241, 0.18)',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <Stack spacing={1.5}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(99, 102, 241, 0.12)',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" className="muted-text">
        {description}
      </Typography>
    </Stack>
  </Paper>
);
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/v1/users/register', {
        email,
        password,
        name,
      });
      setMessage(`User created: ${response.data.data.id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Registration failed');
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
          maxWidth: 720,
          width: '100%',
          p: { xs: 4, md: 6 },
          backdropFilter: 'blur(16px)',
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.16em', fontWeight: 600 }}>
              Добавить участника команды
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
              Регистрация нового аккаунта
            </Typography>
            <Typography className="muted-text" sx={{ mt: 1.5 }}>
              Создайте доступ для инженеров, менеджеров и администраторов. Назначайте роли после входа администратора в систему.
            </Typography>
          </Box>

          <Stepper activeStep={1} alternativeLabel>
            {["Контакт","Доступ","Подтверждение"].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit} display="grid" gap={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <TextField label="Имя и должность" value={name} onChange={(e) => setName(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
              <TextField label="Рабочий email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />
            </Stack>
            <TextField label="Временный пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth InputLabelProps={{ shrink: true }} />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <FeatureCard icon={<EngineeringOutlinedIcon color="primary" />} title="Инженер" description="Доступ к назначенным заказам, отметка прогресса и загрузка отчетов." />
              <FeatureCard icon={<ShieldOutlinedIcon color="secondary" />} title="Менеджер" description="Управление статусами заказов, распределение ресурсов и контроль SLA." />
              <FeatureCard icon={<PersonAddAltRoundedIcon sx={{ color: '#38bdf8' }} />} title="Администратор" description="Создание аккаунтов, настройка ролей и доступ ко всем данным." />
            </Stack>

            <FormControlLabel
              control={<Checkbox required />}
              label="Подтверждаю, что пользователь ознакомлен с политикой безопасности и соглашается с обработкой данных"
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Typography variant="body2" className="muted-text">
                Роли можно изменить после входа администратора в разделе «Профиль»
              </Typography>
              <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAltRoundedIcon />}>Создать аккаунт</Button>
            </Stack>
          </Box>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
