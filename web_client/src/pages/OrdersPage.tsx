import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Chip,
  Stack,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Avatar,
  alpha,
} from '@mui/material';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import axios from 'axios';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  const fetchOrders = async () => {
    if (!token) {
      setError('Please log in first');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/v1/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.data.items ?? []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Failed to load orders');
      } else {
        setError('Unexpected error');
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createMockOrder = async () => {
    if (!token) {
      setError('Please log in first');
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await axios.post(
        'http://localhost:3000/v1/orders',
        {
          items: [
            { productId: 'P-100', name: 'Concrete', quantity: 10, price: 1200 },
            { productId: 'P-200', name: 'Steel beams', quantity: 5, price: 2200 },
          ],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Order created');
      fetchOrders();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Failed to create order');
      } else {
        setError('Unexpected error');
      }
    }
  };

  const updateStatus = async (orderId: string) => {
    if (!token) {
      setError('Please log in first');
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/v1/orders/${orderId}/status`,
        { status: status || 'in_progress' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Status updated');
      setStatus('');
      fetchOrders();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error?.message ?? 'Failed to update status');
      } else {
        setError('Unexpected error');
      }
    }
  };

  const metrics = [
    {
      title: 'Активные заказы',
      icon: <AutorenewRoundedIcon color="secondary" />,
      value: orders.filter((order) => order.status === 'in_progress').length,
      description: 'В работе, ожидают выполнения этапов',
    },
    {
      title: 'Завершено за квартал',
      icon: <AssignmentTurnedInRoundedIcon color="success" />,
      value: orders.filter((order) => order.status === 'completed').length,
      description: 'Все задачи по заказу закрыты',
    },
    {
      title: 'Требует внимания',
      icon: <WarningAmberRoundedIcon color="warning" />,
      value: orders.filter((order) => order.status === 'cancelled').length,
      description: 'Потребуются корректировки или перезапуск',
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.18em', fontWeight: 600 }}>
          Статус заказов
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
          Операционная панель управления заказами
        </Typography>
        <Typography className="muted-text" sx={{ mt: 1.5 }}>
          Контролируйте стадии выполнения, следите за SLA и оперативно обновляйте статусы.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} md={4} key={metric.title}>
            <Card
              className="glass-panel"
              sx={{
                borderRadius: 22,
                background: 'rgba(255,255,255,0.78)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ background: alpha('#6366f1', 0.12), color: 'primary.main' }}>{metric.icon}</Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {metric.title}
                    </Typography>
                  </Stack>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" className="muted-text">
                    {metric.description}
                  </Typography>
                  <LinearProgress variant="determinate" value={Math.min(100, metric.value * 25)} sx={{ height: 8, borderRadius: 8 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper className="glass-panel" sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimelineRoundedIcon fontSize="inherit" /> Канбан заказов
            </Typography>
            <Typography variant="body2" className="muted-text">
              Создавайте тестовые заказы и обновляйте их статус в режиме реального времени.
            </Typography>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" onClick={createMockOrder}>
              Создать демо заказ
            </Button>
            <Button variant="outlined" color="secondary" onClick={fetchOrders}>
              Обновить список
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Установить статус"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="in_progress / completed / cancelled"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="outlined" color="secondary" onClick={() => setStatus('in_progress')} sx={{ whiteSpace: 'nowrap' }}>
            По умолчанию — In progress
          </Button>
        </Stack>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper variant="outlined" sx={{ borderRadius: 18, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'rgba(99, 102, 241, 0.08)' }}>
                <TableCell>Идентификатор</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Сумма</TableCell>
                <TableCell>Состав заказа</TableCell>
                <TableCell>Создан</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={
                        order.status === 'completed'
                          ? 'success'
                          : order.status === 'cancelled'
                          ? 'error'
                          : 'warning'
                      }
                      variant={order.status === 'in_progress' ? 'outlined' : 'filled'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {order.totalAmount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      {order.items.map((item) => (
                        <Typography key={item.productId} variant="body2" className="muted-text">
                          {item.name} • {item.quantity} × {item.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                        </Typography>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="text" size="small" onClick={() => updateStatus(order.id)}>
                      Обновить статус
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Paper>
    </Stack>
  );
};

export default OrdersPage;
