'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from '@/i18n/LanguageProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
