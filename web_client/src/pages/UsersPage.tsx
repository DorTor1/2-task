import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Stack,
  Grid,
  Chip,
  Avatar,
  Breadcrumbs,
  Link,
  Tooltip,
} from '@mui/material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  createdAt: string;
}

type Pagination = {
  page: number;
  pageSize: number;
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<{ email?: string; role?: string }>({});
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 5 });
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  const fetchUsers = async () => {
    if (!token) {
      setError('Login as admin to view users');
      return;
    }
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });
      if (filters.email) params.append('email', filters.email);
      if (filters.role) params.append('role', filters.role);

      const response = await axios.get(`http://localhost:3000/v1/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data.items ?? []);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Failed to load users');
      } else {
        setError('Unexpected error');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.pageSize]);

  const changePage = (delta: number) => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page + delta) }));
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Breadcrumbs separator={<ArrowForwardIosRoundedIcon sx={{ fontSize: 12 }} />}>
          <Link underline="hover" color="inherit" href="#">
            Главная
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Администрирование
          </Link>
          <Typography color="text.primary">Пользователи</Typography>
        </Breadcrumbs>
        <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 600, mt: 2 }}>
          Управление доступом
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          Администрирование пользователей и ролей
        </Typography>
        <Typography className="muted-text" sx={{ mt: 1.5 }}>
          Контролируйте доступ к платформе, фильтруйте сотрудников по ролям и актуализируйте контактные данные.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {[{
          title: 'Всего пользователей',
          value: users.length,
          icon: <GroupOutlinedIcon color="primary" />,
          description: 'Активные аккаунты в системе',
        }, {
          title: 'Роль менеджер',
          value: users.filter((user) => user.roles.includes('manager')).length,
          icon: <ManageAccountsOutlinedIcon color="secondary" />,
          description: 'Координаторы проектов',
        }, {
          title: 'Роль администратор',
          value: users.filter((user) => user.roles.includes('admin')).length,
          icon: <ShieldOutlinedIcon color="success" />,
          description: 'Полные права доступа',
        }].map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 22 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 48, height: 48, background: 'rgba(99, 102, 241, 0.16)', color: 'primary.main' }}>
                  {card.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" className="muted-text">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" className="muted-text">
                    {card.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper className="glass-panel" sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={3}>
          <Box>
            <Typography variant="h6">Фильтрация</Typography>
            <Typography variant="body2" className="muted-text">
              Сужайте выборку по email или роли для точной работы с данными.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              label="Email"
              value={filters.email ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="Роль"
              value={filters.role ?? ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="contained" onClick={fetchUsers}>
              Применить
            </Button>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={() => changePage(-1)}>
            Назад
          </Button>
          <Tooltip title="Текущая страница">
            <Typography>Стр. {pagination.page}</Typography>
          </Tooltip>
          <Button variant="outlined" onClick={() => changePage(1)}>
            Вперёд
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper className="glass-panel" sx={{ p: 0, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'rgba(99, 102, 241, 0.08)' }}>
              <TableCell>Пользователь</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роли</TableCell>
              <TableCell>Дата создания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ background: 'rgba(99, 102, 241, 0.15)', color: 'primary.main' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" className="muted-text">
                        ID: {user.id.slice(0, 8)}...
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {user.roles.map((role) => (
                      <Chip key={role} label={role} color={role === 'admin' ? 'primary' : role === 'manager' ? 'secondary' : 'default'} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString('ru-RU')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default UsersPage;
