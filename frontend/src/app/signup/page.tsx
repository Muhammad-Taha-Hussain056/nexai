'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

import { authService } from '@/services/authService';

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" fill="none">
    <rect x="1" y="1" width="9" height="9" fill="#00A2ED"/>
    <rect x="11" y="1" width="9" height="9" fill="#00A2ED"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A2ED"/>
    <rect x="11" y="11" width="9" height="9" fill="#00A2ED"/>
  </svg>
);

function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    return /^\S+@\S+\.\S+$/.test(email) ? null : 'Enter a valid email';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return password.length >= 8 ? null : 'Password must be at least 8 characters';
  }, [password]);

  const nameError = useMemo(() => {
    if (!name) return null;
    return name.trim().length >= 2 ? null : 'Name must be at least 2 characters';
  }, [name]);

  const canSubmit = !!name && !!email && !!password && !emailError && !passwordError && !nameError && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await authService.signup({
        fullName: name.trim(),
        email: email.trim(),
        password,
      });

      router.push(`/login?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="body2" fontWeight={700} color="text.primary" mb={1}>Full Name</Typography>
          <TextField
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            fullWidth
            error={!!nameError}
            helperText={nameError ?? ' '}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                bgcolor: '#F9FAFB',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
              }
            }}
          />
        </Box>

        <Box sx={{ mt: '-8px !important' }}>
          <Typography variant="body2" fontWeight={700} color="text.primary" mb={1}>Email address</Typography>
          <TextField
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            fullWidth
            error={!!emailError}
            helperText={emailError ?? ' '}
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                bgcolor: '#F9FAFB',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
              }
            }}
          />
        </Box>

        <Box sx={{ mt: '-8px !important' }}>
          <Typography variant="body2" fontWeight={700} color="text.primary" mb={1}>Password</Typography>
          <TextField
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            error={!!passwordError}
            helperText={passwordError ?? ' '}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: '#F9FAFB',
                '& fieldset': { borderColor: '#E5E7EB' },
                '&:hover fieldset': { borderColor: '#D1D5DB' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1px' },
              }
            }}
          />
        </Box>

        {error && (
          <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 600, mt: '-8px !important' }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            mt: '8px !important',
            borderRadius: 3,
            py: 1.5,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '1rem',
            bgcolor: '#D46F35',
            '&:hover': { bgcolor: '#B3511D' },
            '&.Mui-disabled': { bgcolor: '#FDCBBA', color: 'white' }
          }}
        >
          {submitting ? 'Creating…' : 'Create Account'}
        </Button>
      </Stack>
    </Box>
  );
}

export default function SignupPage() {
  const router = useRouter();

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#7C7975', // Dark grey background matching the image
      py: { xs: 4, md: 8 },
      px: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 1000,
        bgcolor: 'white',
        borderRadius: 5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        minHeight: 650
      }}>
        {/* Left Side: Dark Info Panel */}
        <Box sx={{
          width: { xs: '100%', md: '45%' },
          bgcolor: '#291E16',
          background: 'linear-gradient(180deg, #2A1D15 0%, #17110C 100%)',
          color: 'white',
          p: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Faint dot pattern overlay */}
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, zIndex: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            backgroundPosition: '-19px -19px'
          }} />

          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5} position="relative" zIndex={1} mb={8}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#D46F35" />
              <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white" />
            </svg>
            <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px">NexusAI</Typography>
          </Box>

          <Box flex={1} display="flex" flexDirection="column" justifyContent="center" position="relative" zIndex={1}>
            {/* Glowing Avatar */}
            <Box mb={5} display="flex" justifyContent="center">
              <Box sx={{
                width: 140, height: 140, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(212,111,53,0.15)',
                bgcolor: 'rgba(212,111,53,0.05)'
              }}>
                <Box sx={{ width: 64, height: 64, fontSize: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.4))' }}>
                  🤖
                </Box>
              </Box>
            </Box>

            <Typography variant="h4" fontWeight={800} mb={2} lineHeight={1.2} textAlign="center">
              Build Smarter<br />with AI Agents
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)" textAlign="center" mb={6} sx={{ px: 2 }}>
              Access 525+ models, create custom agents, and automate your workflow — all in one platform.
            </Typography>

            <Stack spacing={2.5}>
              {[
                 { icon: '🧠', text: '525+ AI models from 30+ labs', color: '#FEE2E2' },
                 { icon: '⚡', text: 'Custom agent builder with any model', color: '#FEF3C7' },
                 { icon: '🔗', text: 'Connect tools, memory & APIs', color: '#F3E8FF' },
                 { icon: '📊', text: 'Real-time analytics & monitoring', color: '#E0F2FE' },
              ].map((feature, i) => (
                <Box key={i} display="flex" alignItems="center" gap={2}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Right Side: Auth Form */}
        <Box sx={{
          width: { xs: '100%', md: '55%' },
          p: { xs: 4, md: 8, lg: 10 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Close Button top-right */}
          <IconButton onClick={() => router.push('/')} sx={{ position: 'absolute', top: 24, right: 24, bgcolor: '#F3F4F6', border: '1px solid #E5E7EB', '&:hover': { bgcolor: '#E5E7EB' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>

          <Box mb={6} mt={2}>
            {/* Tabs */}
            <Box display="flex" gap={4} mb={6} borderBottom="1px solid #E5E7EB">
              <Typography component={Link} href="/login" sx={{ pb: 1.5, fontWeight: 700, color: '#9CA3AF', cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#6B7280' } }}>Sign In</Typography>
              <Typography sx={{ pb: 1.5, borderBottom: '2px solid #D46F35', fontWeight: 800, color: '#D46F35', cursor: 'pointer' }}>Create Account</Typography>
            </Box>

            <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px" mb={1}>
              Join NexusAI
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get started in under a minute. No credit card required.
            </Typography>
          </Box>

          <SignupForm />

          <Box mt={4} width="100%">
            <Divider sx={{ typography: 'body2', color: 'text.disabled', '&::before, &::after': { borderColor: '#E5E7EB' } }}>
              Or continue with
            </Divider>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mt={4}>
              <Button variant="outlined" startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />} sx={{ flex: 1, py: 1, borderRadius: 2, borderColor: '#E5E7EB', color: 'text.primary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' } }}>Google</Button>
              <Button variant="outlined" startIcon={<GitHubIcon sx={{ color: '#111827' }}/>} sx={{ flex: 1, py: 1, borderRadius: 2, borderColor: '#E5E7EB', color: 'text.primary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' } }}>GitHub</Button>
              <Button variant="outlined" startIcon={<MicrosoftIcon />} sx={{ flex: 1, py: 1, borderRadius: 2, borderColor: '#E5E7EB', color: 'text.primary', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' } }}>Microsoft</Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" textAlign="center" mt={4} fontWeight={500}>
              Already have an account?{' '}
              <Typography component={Link} href="/login" variant="body2" sx={{ color: '#D46F35', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Sign in →
              </Typography>
            </Typography>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
