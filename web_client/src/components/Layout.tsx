import React, { PropsWithChildren, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Stack,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
  { label: 'Orders', path: '/orders' },
  { label: 'Users', path: '/users' },
];

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const drawer = (
    <Box
      sx={{
        textAlign: 'left',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        pb: 3,
      }}
    >
      <Box sx={{ px: 3, py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              background: alpha('#6366f1', 0.16),
              color: '#6366f1',
            }}
          >
            <SpaceDashboardRoundedIcon />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', letterSpacing: '0.08em' }}>
              Task Control
            </Typography>
            <Typography variant="h6">Operations Hub</Typography>
          </Box>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: alpha('#94a3b8', 0.14) }} />
      <List sx={{ px: 1.5, pt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                color: location.pathname === item.path ? '#6366f1' : '#e2e8f0',
                '&:hover': {
                  background: alpha('#6366f1', 0.22),
                },
              }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ px: 3, mt: 'auto' }}>
        <Box
          className="glass-panel"
          sx={{
            px: 2.5,
            py: 2,
            borderRadius: 18,
            background: 'rgba(15, 23, 42, 0.65)',
            color: '#e2e8f0',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.5, color: '#cbd5f5' }}>
            Быстрый выход
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Завершите работу и покиньте систему, когда задачи выполнены.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<LogoutRoundedIcon />}
            sx={{ mt: 2, borderRadius: 12 }}
          >
            Выйти
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 18px 40px -24px rgba(15, 23, 42, 0.65)',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Task Control Platform
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Typography variant="body2" sx={{ color: 'rgba(226, 232, 240, 0.9)' }}>
              Обновлено 5 минут назад
            </Typography>
            <Button variant="outlined" color="inherit" size="small" sx={{ borderRadius: 12, borderColor: 'rgba(226, 232, 240, 0.3)' }}>
              Центр помощи
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2.5, md: 4 },
          py: { xs: 12, md: 12 },
          mt: 0,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Box
            className="glass-panel hero-gradient"
            sx={{
              borderRadius: 26,
              px: { xs: 4, md: 6 },
              py: { xs: 5, md: 6 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ maxWidth: 520 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Центр управления задачами проектной команды
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: 16 }}>
                Следите за проектами, координируйте исполнителей и держите клиентов в курсе.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Button variant="contained" color="secondary" sx={{ borderRadius: 14 }}>
                Создать задачу
              </Button>
              <Button variant="outlined" color="inherit" sx={{ borderRadius: 14, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                Руководство
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
