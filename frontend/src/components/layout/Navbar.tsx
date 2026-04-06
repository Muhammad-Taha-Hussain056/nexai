'use client';

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DiamondIcon from '@mui/icons-material/Diamond';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LanguageCode } from '@/i18n/translations';

const navItems = [
  { key: 'nav.chatHub', path: '/chat', icon: <ChatBubbleOutlineIcon fontSize="small" sx={{ mr: 0.75, opacity: 0.8, fontSize: '1.1rem' }} /> },
  { key: 'nav.marketplace', path: '/marketplace', icon: <StorefrontIcon fontSize="small" sx={{ mr: 0.75, opacity: 0.8, fontSize: '1.1rem' }} /> },
  { key: 'nav.agents', path: '/agents', icon: <SmartToyIcon fontSize="small" sx={{ mr: 0.75, opacity: 0.8, fontSize: '1.1rem' }} /> },
  { key: 'nav.discoverNew', path: '/discover', icon: <ExploreOutlinedIcon fontSize="small" sx={{ mr: 0.75, opacity: 0.8, fontSize: '1.1rem' }} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const openLang = Boolean(anchorEl);
  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleLangClose = () => { setAnchorEl(null); };

  const languages = [
    { code: 'SA', name: 'العربية' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'ES', name: 'Español' },
    { code: 'BR', name: 'Português' },
    { code: 'CN', name: '中文' },
    { code: 'JP', name: '日本語' },
    { code: 'KR', name: '한국어' },
    { code: 'IN', name: 'हिन्दी' },
    { code: 'PK', name: 'اردو' },
    { code: 'TR', name: 'Türkçe' },
    { code: 'RU', name: 'Русский' },
    { code: 'IT', name: 'Italiano' },
    { code: 'NL', name: 'Nederlands' },
  ];

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    handleLangClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'transparent',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backdropFilter: 'blur(8px)',
        pt: 1,
        pb: 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 0.5, 
              borderRadius: 1.5, 
              display: 'flex', 
              mr: 1 
            }}
          >
            <DiamondIcon fontSize="small" />
          </Box>
          <Typography variant="h6" fontWeight="bold" letterSpacing="-0.5px" color="text.primary">
            NexusAI
          </Typography>
        </Box>

        {/* Center Nav Links */}
        <Stack direction="row" spacing={3} display={{ xs: 'none', md: 'flex' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            return (
              <Button 
                key={item.key}
                component={Link}
                href={item.path}
                sx={{ 
                  color: isActive ? '#BF6132' : 'text.secondary',
                  fontWeight: isActive ? 700 : 500,
                  bgcolor: isActive ? '#FFF4ED' : 'transparent',
                  border: isActive ? '1px solid #BF6132' : '1px solid transparent',
                  px: 2,
                  py: 0.75,
                  borderRadius: 6,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: isActive ? '#FFE8DC' : '#F3F4F6',
                  }
                }}
              >
                {item.icon}
                {t(item.key as keyof typeof t)}
              </Button>
            );
          })}
        </Stack>

        {/* Right Actions */}
        <Stack direction="row" spacing={2} alignItems="center">
          <>
            <Button 
              onClick={handleLangClick}
              variant="outlined" 
              size="small"
              startIcon={<LanguageIcon fontSize="small" />}
              endIcon={<KeyboardArrowDownIcon fontSize="small" />}
              sx={{ 
                borderColor: openLang ? 'primary.main' : '#E5E7EB', 
                color: openLang ? 'primary.main' : 'text.primary',
                bgcolor: openLang ? '#FFF4ED' : 'transparent',
                borderRadius: 6,
                px: { xs: 1, sm: 2 },
                minWidth: 0,
                display: { xs: 'none', sm: 'flex'},
                '&:hover': { bgcolor: openLang ? '#FFF4ED' : 'rgba(0,0,0,0.04)', borderColor: openLang ? 'primary.main' : '#E5E7EB' }
              }}
            >
              {language}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={openLang}
              onClose={handleLangClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflowX: 'visible',
                  overflowY: 'auto',
                  filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  maxHeight: 400,
                  border: '1px solid #E5E7EB'
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ px: 2, pt: 1, pb: 0.5, display: 'block', lineHeight: 1 }}>
                {t('lang.appLanguage')}
              </Typography>
              <Divider sx={{ mb: 0 }} />
              <MenuItem
                onClick={() => handleLanguageSelect('US')}
                sx={{
                  bgcolor: language === 'US' ? '#FFF4ED' : 'transparent',
                  color: language === 'US' ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: language === 'US' ? '#FFF4ED' : 'rgba(0,0,0,0.04)' },
                  py: 1.5,
                }}
              >
                <Typography variant="caption" fontWeight={800} sx={{ mr: 1, width: 20 }}>US</Typography>
                <Typography variant="body2" fontWeight={language === 'US' ? 700 : 500}>English</Typography>
              </MenuItem>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as LanguageCode)}
                  sx={{
                    color: language === lang.code ? 'primary.main' : 'text.secondary',
                    bgcolor: language === lang.code ? '#FFF4ED' : 'transparent',
                    '&:hover': { bgcolor: language === lang.code ? '#FFF4ED' : 'rgba(0,0,0,0.04)' },
                    py: 1.5,
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ mr: 1, width: 20 }}>{lang.code}</Typography>
                  <Typography variant="body2" fontWeight={language === lang.code ? 700 : 500}>{lang.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
          <Button 
            component={Link}
            href="/login"
            variant="outlined" 
            sx={{ 
              borderColor: '#E5E7EB', 
              color: 'text.primary',
              borderRadius: 6,
              px: 3,
              display: { xs: 'none', sm: 'flex'},
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            {t('nav.signIn')}
          </Button>
          <Button 
            component={Link}
            href="/signup"
            variant="contained" 
            disableElevation
            sx={{ 
              borderRadius: 6,
              px: { xs: 2, sm: 3 },
              py: 0.75,
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(180deg, #D46F35 0%, #B3511D 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(180deg, #CA6228 0%, #A34818 100%)',
              }
            }}
          >
            {t('nav.tryFree')} →
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
