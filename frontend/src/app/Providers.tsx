'use client';

import React, { useEffect } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { useStore } from '@/store/useStore';
import { getCookie, removeCookie } from '@/lib/cookies';
import { authService } from '@/services/authService';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setUser = useStore((state) => state.setUser);
  
  useEffect(() => {
    async function initAuth() {
      const token = getCookie('accessToken');
      if (token) {
        try {
          const res = await authService.getMe(token);
          setUser(res.user);
        } catch (err) {
          console.error("Auth init failed:", err);
          removeCookie('accessToken');
          removeCookie('refreshToken');
          setUser(null);
        }
      }
    }
    void initAuth();
  }, [setUser]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LanguageProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </LanguageProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
