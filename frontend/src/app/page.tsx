'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Container, Paper, TextField,
  CardActionArea, IconButton, Chip, Button, Stack, Dialog, DialogContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import ModelCard from '../components/marketplace/ModelCard';
import modelsData from '../data/models.json';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import BoltIcon from '@mui/icons-material/Bolt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TvIcon from '@mui/icons-material/Tv';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { generateOnboardingPrompt, saveOnboarding } from '@/lib/api';
import { useLanguage } from '@/i18n/LanguageProvider';

const actions = [
  { icon: '🎨', label: 'Create image' },
  { icon: '🎵', label: 'Generate Audio' },
  { icon: '🎬', label: 'Create video' },
  { icon: '📊', label: 'Create slides' },
  { icon: '📈', label: 'Create Infographs' },
  { icon: '❓', label: 'Create quiz' },
  { icon: '🗂️', label: 'Create Flashcards' },
  { icon: '🧠', label: 'Create Mind map' },
  { icon: '📉', label: 'Analyze Data' },
  { icon: '✍️', label: 'Write content' },
  { icon: '💻', label: 'Code Generation' },
  { icon: '📄', label: 'Document Analysis' },
  { icon: '🌐', label: 'Translate' },
  { icon: '🔭', label: 'Just Exploring' },
];

const stats = [
  { value: '525+', label: 'AI Models' },
  { value: '82K', label: 'Builders' },
  { value: '28', label: 'AI Labs' },
  { value: '4.8 ⭐', label: 'Avg Rating' },
];

const builderFeatures = [
  { icon: '⏱️', title: 'Guided Discovery Chat', desc: "I'll greet you, ask about your goals, and have a genuine conversation before recommending models. No overwhelming lists." },
  { icon: '📐', title: 'Prompt Engineering Guide', desc: 'Every model includes tailored prompt templates, principles, and examples so you get the best output from day one.' },
  { icon: '🤖', title: 'Agent Builder', desc: 'Step-by-step agent creation guides for every model — system prompts, tool configuration, memory setup, deployment.' },
  { icon: '💰', title: 'Flexible Pricing', desc: 'Free tiers, pay-per-use, subscriptions, and enterprise plans. Transparent pricing with no hidden fees.' },
  { icon: '⭐', title: 'User Reviews & Ratings', desc: 'Verified reviews from real builders, benchmark scores, and detailed I/O specs to help you choose confidently.' },
  { icon: '🔭', title: 'Research Feed', desc: 'Daily curated AI research, model releases, and breakthroughs from top labs — stay ahead of the curve.' },
];

const labs = [
  { icon: '🧠', name: 'OpenAI', sub: '3 models · GPT-5.4, Sora 2' },
  { icon: '👑', name: 'Anthropic', sub: '3 models · Opus, Sonnet, Haiku' },
  { icon: '🔭', name: 'Google DeepMind', sub: '5 models · Gemini 3.1, Veo 3' },
  { icon: '✕', name: 'xAI (Grok)', sub: '2 models · Grok-4-1, Grok-Imagine' },
  { icon: '💻', name: 'DeepSeek', sub: '3 models · V3, V3.2, R1' },
  { icon: '🦙', name: 'Meta (Llama)', sub: '2 models · Maverick, Scout' },
  { icon: '🏮', name: 'Alibaba (Qwen)', sub: '2 models · Qwen3-Max, Coder' },
  { icon: '🌀', name: 'Mistral', sub: '2 models · Devstral 2, Medium 3.1' },
  { icon: '💠', name: 'NVIDIA NIM', sub: '4 models · Nemotron Ultra, Nano' },
  { icon: '◆', name: 'GLM (Zhipu)', sub: '3 models · GLM-5, 47, 4.6V' },
  { icon: '🌙', name: 'Moonshot (Kimi)', sub: '2 models · k2.5, k2-Thinking' },
];

const comparisonRows = [
  { icon: '🧠', name: 'GPT-5.4', lab: 'OpenAI', context: '1.05M', input: '$2.50', output: '$15', multimodal: true, speed: 'fast', bestFor: 'High-precision professional tasks' },
  { icon: '👑', name: 'Claude Opus 4.6', lab: 'Anthropic', context: '200K/1M β', input: '$5', output: '$25', multimodal: true, speed: 'moderate', bestFor: 'Agents, advanced coding' },
  { icon: '⚡', name: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K/1M β', input: '$3', output: '$15', multimodal: true, speed: 'fast', bestFor: 'Code, data, content at scale' },
  { icon: '🚀', name: 'Claude Haiku 4.5', lab: 'Anthropic', context: '200K', input: '$1', output: '$5', multimodal: true, speed: 'fastest', bestFor: 'Real-time, high-volume' },
  { icon: '🔭', name: 'Gemini 3.1 Pro', lab: 'Google', context: '2M–5M', input: '$2', output: '$12', multimodal: true, speed: 'moderate', bestFor: 'Deep reasoning, long context' },
  { icon: '⚡', name: 'Gemini 3 Flash', lab: 'Google', context: '1M', input: '$2', output: '$12', multimodal: true, speed: 'moderate', bestFor: 'High-volume chat & coding' },
  { icon: '💡', name: 'Gemini 3.1 Flash-Lite', lab: 'Google', context: '1M', input: '$0.10', output: '$0.40', multimodal: true, speed: 'fastest', bestFor: 'Low-cost agents, translation' },
  { icon: '✕', name: 'Grok-4-1 Fast', lab: 'xAI', context: '2000K', input: '$0.20', output: '$0.50', multimodal: true, speed: 'moderate', bestFor: 'Real-time X data analysis' },
  { icon: '💻', name: 'DeepSeek-V3', lab: 'DeepSeek', context: '128K', input: '~$0.07', output: '~$0.28', multimodal: true, speed: 'moderate', bestFor: 'Budget general model' },
  { icon: '🦙', name: 'Llama 4 Maverick', lab: 'Meta', context: '128K', input: 'Free', output: 'Free', multimodal: true, speed: 'moderate', bestFor: 'Open-source multimodal' },
  { icon: '🏮', name: 'Qwen3-Max', lab: 'Alibaba', context: '128K', input: '$0.40', output: '$1.20', multimodal: true, speed: 'moderate', bestFor: 'Multilingual / APAC' },
];

const trendingItems = [
  { badge: 'Just Released', badgeColor: '#E0F2F1', badgeText: '#00695C', provider: 'Anthropic', title: 'Claude Opus 4.6 & Sonnet 4.6', desc: 'Adaptive Thinking and 1M token context (beta) mark a major leap in agent capability. Now the most intelligent Claude for coding and agentic tasks.' },
  { badge: 'Hot', badgeColor: '#FFF4ED', badgeText: '#C2612E', provider: 'Google DeepMind', title: 'Gemini 3.1 Pro — Thought Signatures', desc: 'Thought Signatures bring new transparency to deep reasoning. 5M context window makes it the go-to for ultra-long document analysis.' },
  { badge: 'Computer Use', badgeColor: '#F3E8FF', badgeText: '#7C3AED', provider: 'OpenAI', title: 'GPT-5.4 — Native Computer-Use Agents', desc: 'GPT-5.4 introduces native computer-use agents, letting it operate browsers, apps, and files autonomously with improved reasoning efficiency.' },
  { badge: 'Real-Time', badgeColor: '#FFF0F0', badgeText: '#B91C1C', provider: 'xAI', title: 'Grok-4-1 Fast — 4-Agent Architecture', desc: "Grok's 4-agent architecture with real-time X (Twitter) data access and 2M context makes it unique for real-time analysis tasks." },
  { badge: 'Open Source', badgeColor: '#F0FFF4', badgeText: '#15803D', provider: 'Meta', title: 'Llama 4 Maverick — 400B MoE', desc: "Meta's 400B Mixture-of-Experts model with native multimodal understanding. Free to self-host with a full commercial licence." },
  { badge: 'Coding', badgeColor: '#EFF6FF', badgeText: '#1D4ED8', provider: 'Mistral', title: 'Devstral 2 — Fastest Coding Agent', desc: "Mistral's coding agent with 256K context, multi-file edits, and codebase navigation. The fastest software engineering model available." },
];

const budgetTiers = [
  {
    icon: '🆓',
    label: 'Free & Open Source',
    color: '#059669',
    bgColor: '#ECFDF5',
    desc: 'Llama 4 Maverick, Llama 4 Scout, DeepSeek-V3, DeepSeek-R1 — self-host with zero API cost.',
    count: 6,
  },
  {
    icon: '💎',
    label: 'Budget – Under $0.50/1M',
    color: '#1A73E8',
    bgColor: '#EFF6FF',
    desc: 'Gemini 3.1 Flash-Lite, Mistral Medium, Nemotron Nano — best performance per dollar.',
    count: 9,
  },
  {
    icon: '⚖️',
    label: 'Mid-Range – $1–$5/1M',
    color: '#B45309',
    bgColor: '#FFFBEB',
    desc: 'Claude Sonnet 4.6, Claude Haiku 4.5, Gemini 3.1 Pro, GPT-5.4, Qwen3-Max.',
    count: 11,
  },
  {
    icon: '🏆',
    label: 'Premium – $5+/1M',
    color: '#C2612E',
    bgColor: '#FFF4ED',
    desc: 'Claude Opus 4.6, Sora 2 Pro, gpt-image-1.5 — top-tier quality for demanding workloads.',
    count: 5,
  },
];

const useCases = [
  { icon: '💻', name: 'Code Generation', models: 'Claude Opus 4.6, Devstral 2, GPT-5.4, Qwen3-Coder', cta: 'Start building →' },
  { icon: '🎨', name: 'Image Generation', models: 'gpt-image-1.5, Grok-Imagine-Pro, Gemini Flash Image', cta: 'Create images →' },
  { icon: '🤖', name: 'AI Agents', models: 'GPT-5.4, Claude Opus 4.6, kimi-k2.5, Grok-4-1', cta: 'Build agents →' },
  { icon: '📄', name: 'Document Analysis', models: 'Claude Sonnet 4.6, Gemini 3.1 Pro, Nemotron Ultra', cta: 'Analyse docs →' },
  { icon: '🎬', name: 'Video Generation', models: 'Sora 2 Pro, Veo 3.1, Grok-Imagine-Video', cta: 'Create video →' },
  { icon: '🔊', name: 'Voice & Audio', models: 'Gemini-TTS, ElevenLabs, Whisper v3', cta: 'Add voice →' },
  { icon: '🌐', name: 'Multilingual / Translation', models: 'Qwen3-Max (119 langs), Gemini 3.1 Flash-Lite, GLM-4.7', cta: 'Go multilingual →' },
  { icon: '🔬', name: 'Math & Research', models: 'DeepSeek-R1, QwQ-32B, Gemini 3.1 Pro', cta: 'Start researching →' },
];

interface SpeechRecognitionResultEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const featuredModels = modelsData.slice(0, 6);
  const [heroInput, setHeroInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'question' | 'done'>('welcome');
  const [quickChoice, setQuickChoice] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [clientSessionId, setClientSessionId] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const existing = window.localStorage.getItem('nexus_session_id');
    if (existing) {
      setClientSessionId(existing);
      return;
    }
    const created = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem('nexus_session_id', created);
    setClientSessionId(created);
  }, []);

  const appendToInput = (text: string) => {
    setHeroInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  const handleVoiceInput = () => {
    const speechApi = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SpeechRecognition = speechApi.SpeechRecognition || speechApi.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      appendToInput('[Voice not supported in this browser]');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript.trim()) appendToInput(transcript.trim());
    };
    recognition.onerror = () => appendToInput('[Voice capture failed]');
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handlePickerFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    label: 'File' | 'Image' | 'Video',
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name).join(', ');
    appendToInput(`[${label}: ${names}]`);
    event.target.value = '';
  };

  const handleAddLink = () => {
    const link = window.prompt('Paste a URL');
    if (!link) return;
    appendToInput(`[Link: ${link}]`);
  };

  const openOnboarding = () => {
    setOnboardingStep('welcome');
    setQuickChoice('');
    setOnboardingOpen(true);
  };

  const goToHub = () => {
    setOnboardingOpen(false);
    const q = generatedPrompt || heroInput || quickChoice;
    router.push(q ? `/chat?q=${encodeURIComponent(q)}` : '/chat');
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Navbar />

      {/* ── HERO ── */}
      <Container maxWidth="md" sx={{ textAlign: 'center', pt: 8, pb: 4 }}>
        <Box display="inline-block" mb={4}>
          <Chip
            label="• 525 models live · Updated daily"
            sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'text.secondary', fontWeight: 500, border: '1px solid #E5E7EB', '& .MuiChip-label': { px: 2 } }}
          />
        </Box>

        <Box sx={{ mt: 2, mb: 6 }}>
          <Typography variant="h1" sx={{ fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.1, fontSize: { xs: '3rem', md: '5rem' }, color: 'text.primary' }}>
            Find your perfect <br />
            <Typography component="span" variant="inherit" sx={{ color: '#BF6132' }}>AI model</Typography>
            <br />
            with guided<br />
            discovery
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 4, fontWeight: 500, fontSize: '1.1rem' }}>
            You don't need to know anything about AI to get started. Just<br />
            click the box below — we'll do the rest together. ✨
          </Typography>
        </Box>

        {/* Input Bar Container */}
        <Box sx={{ maxWidth: 840, mx: 'auto', mb: 8, position: 'relative' }}>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={(e) => handlePickerFile(e, 'File')}
          />
          <input
            ref={videoInputRef}
            type="file"
            hidden
            multiple
            accept="video/*"
            onChange={(e) => handlePickerFile(e, 'Video')}
          />
          <input
            ref={imageInputRef}
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => handlePickerFile(e, 'Image')}
          />
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 6,
              bgcolor: 'white',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Click here and type anything — or just say hi! 🙋"
              variant="standard"
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { px: 1, py: 1, fontSize: '1.1rem', color: 'text.primary', fontWeight: 500 }
              }}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ pl: 1 }}>
                <IconButton size="small" onClick={handleVoiceInput} sx={{ width: 36, height: 36, bgcolor: '#F3E8FF', color: '#9333EA', '&:hover': { bgcolor: '#E9D5FF' } }}>
                  <MicNoneIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ width: 36, height: 36, bgcolor: '#FEF3C7', color: '#D97706', '&:hover': { bgcolor: '#FDE68A', borderRadius: 2 } }}>
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => imageInputRef.current?.click()} sx={{ width: 36, height: 36, bgcolor: '#EFF6FF', color: '#2563EB', '&:hover': { bgcolor: '#DBEAFE', borderRadius: 2 } }}>
                  <ImageOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ width: 36, height: 36, bgcolor: '#ECFEFF', color: '#0891B2', '&:hover': { bgcolor: '#CFFAFE', borderRadius: 2 } }}>
                  <FileUploadOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => videoInputRef.current?.click()} sx={{ width: 36, height: 36, bgcolor: '#FEE2E2', color: '#DC2626', '&:hover': { bgcolor: '#FECACA', borderRadius: 2 } }}>
                  <VideoCallOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ width: 36, height: 36, bgcolor: '#D1FAE5', color: '#059669', '&:hover': { bgcolor: '#A7F3D0', borderRadius: 2 } }}>
                  <TvIcon fontSize="small" />
                </IconButton>
                
                <Box sx={{ width: '1px', height: 24, bgcolor: '#E5E7EB', mx: 1 }} />
                
                <Button size="small" variant="contained" disableElevation sx={{ bgcolor: '#E5E7EB', color: '#374151', borderRadius: 4, textTransform: 'none', px: 2, py: 0.5, fontWeight: 600, '&:hover': { bgcolor: '#D1D5DB' } }} startIcon={<SmartToyIcon fontSize="small" />} endIcon={<Box component="span" sx={{ fontSize: '1rem', fontWeight: 400, ml: 0.5 }}>+</Box>}>
                  Agent
                </Button>
              </Stack>
              
              <Button onClick={openOnboarding} variant="contained" disableElevation startIcon={<SearchIcon fontSize="small" />} sx={{ borderRadius: 999, py: 1.2, px: 3, textTransform: 'none', fontWeight: 700, bgcolor: '#BF6132', color: 'white', '&:hover': { bgcolor: '#A34E24' } }}>
                Let's go
              </Button>
            </Box>
          </Paper>

          {/* Attached Tabs */}
          <Paper elevation={0} sx={{
            border: '1px solid #E5E7EB',
            borderTop: 'none',
            bgcolor: 'white',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            mt: -3,
            pt: 4,
            px: 2,
            pb: 2,
            textAlign: 'left',
            zIndex: 1,
            position: 'relative'
          }}>
            <Box sx={{ borderBottom: '1px solid #F3F4F6', pb: 1.5, mb: 2, display: 'flex', gap: 2, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
               <Button variant="text" sx={{ color: '#111827', fontWeight: 600, textTransform: 'none', py: 0.5, px: 2, bgcolor: '#F9FAFB', borderRadius: 4 }} startIcon={<GroupIcon fontSize="small" />}>Recruiting</Button>
               <Button variant="text" disableRipple sx={{ color: '#6B7280', fontWeight: 500, textTransform: 'none', py: 0.5, px: 1, '&:hover': { bgcolor: 'transparent', color: '#374151' } }}>{'< >'} Create a prototype</Button>
               <Button variant="text" disableRipple sx={{ color: '#6B7280', fontWeight: 500, textTransform: 'none', py: 0.5, px: 1, '&:hover': { bgcolor: 'transparent', color: '#374151' } }} startIcon={<BusinessIcon fontSize="small" />}>Build a business</Button>
               <Button variant="text" disableRipple sx={{ color: '#6B7280', fontWeight: 500, textTransform: 'none', py: 0.5, px: 1, '&:hover': { bgcolor: 'transparent', color: '#374151' } }} startIcon={<MenuBookIcon fontSize="small" />}>Help me learn</Button>
               <Button variant="text" disableRipple sx={{ color: '#6B7280', fontWeight: 500, textTransform: 'none', py: 0.5, px: 1, '&:hover': { bgcolor: 'transparent', color: '#374151' } }} startIcon={<SearchIcon fontSize="small" />}>Research</Button>
            </Box>
            
            <List disablePadding>
              <ListItemButton sx={{ borderRadius: 2, py: 1, mb: 0.5, '&:hover': { bgcolor: '#F9FAFB' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}><Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🔍</Box></ListItemIcon>
                <ListItemText primary="Monitor job postings at target companies" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} />
              </ListItemButton>
              <ListItemButton sx={{ borderRadius: 2, py: 1, mb: 0.5, '&:hover': { bgcolor: '#F9FAFB' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}><Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>💰</Box></ListItemIcon>
                <ListItemText primary="Benchmark salary for a specific role" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} />
              </ListItemButton>
              <ListItemButton sx={{ borderRadius: 2, py: 1, '&:hover': { bgcolor: '#F9FAFB' } }}>
                <ListItemIcon sx={{ minWidth: 40 }}><Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🗺️</Box></ListItemIcon>
                <ListItemText primary="Build an interactive talent market map" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontWeight: 500 }} />
              </ListItemButton>
            </List>
          </Paper>
        </Box>

        {/* ── ACTION PILLS (Grid) ── */}
        <Box sx={{ maxWidth: 840, mx: 'auto', mb: 8 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' }, gap: 1.5 }}>
            {actions.map((action, i) => (
              <Button key={i} component={Link} href="/chat" variant="outlined" sx={{
                borderRadius: 4,
                borderColor: '#E5E7EB',
                bgcolor: 'white',
                color: 'text.primary',
                textTransform: 'none',
                display: 'flex',
                flexDirection: 'column',
                py: 1.5,
                px: 1,
                gap: 1,
                borderStyle: (action.label === 'Create Mind map' || action.label === 'Just Exploring') ? 'dashed' : 'solid',
                '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' }
              }}>
                <Typography fontSize="1.4rem" lineHeight={1}>{action.icon}</Typography>
                <Typography variant="caption" fontWeight={600} lineHeight={1.1}>{action.label}</Typography>
              </Button>
            ))}
          </Box>
        </Box>

        {/* ── STATS ROW ── */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {stats.map((stat, i) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={800} color="text.primary" lineHeight={1}>{stat.value}</Typography>
              <Typography variant="caption" color="text.disabled" fontWeight={600} mt={1} display="block" sx={{ letterSpacing: '0.05em' }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── FEATURED MODELS ── */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight={700}>{t('home.featuredModels')}</Typography>
            <Button component={Link} href="/marketplace" variant="text" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>{t('home.browseAll')}</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 5 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
            {featuredModels.map((model) => (
              <Box key={model.id} sx={{ minWidth: 280, maxWidth: 280, flexShrink: 0 }}>
                <ModelCard model={model} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── BUILT FOR EVERY BUILDER ── */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Built for every builder</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
          {builderFeatures.map((f, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 3, borderRadius: 3, bgcolor: 'white', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
              <Typography fontSize="1.4rem" mb={1.5}>{f.icon}</Typography>
              <Typography variant="subtitle2" fontWeight={700} mb={1} lineHeight={1.3}>{f.title}</Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1.6} display="block">{f.desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* ── BROWSE BY AI LAB ── */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight={700}>Browse by AI Lab</Typography>
            <Button component={Link} href="/marketplace" variant="text" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>See all labs →</Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 2 }}>
            {labs.map((lab) => (
              <Paper key={lab.name} variant="outlined" component={Link} href="/marketplace" sx={{ p: 2.5, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'all 0.15s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                <Typography fontSize="2rem" mb={1}>{lab.icon}</Typography>
                <Typography variant="body2" fontWeight={700} mb={0.5} lineHeight={1.2}>{lab.name}</Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1.4}>{lab.sub}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FLAGSHIP MODEL COMPARISON ── */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
          <Typography variant="h4" fontWeight={700}>Flagship Model Comparison</Typography>
          <Button component={Link} href="/marketplace" variant="text" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>Compare all →</Button>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={4}>Side-by-side view of the leading models across all major labs. Input/Output prices per 1M tokens.</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {['MODEL', 'LAB', 'CONTEXT', 'INPUT $/1M', 'OUTPUT $/1M', 'MULTIMODAL', 'SPEED', 'BEST FOR'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em', color: 'text.secondary', py: 1.5, whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.name} sx={{ '&:hover': { bgcolor: '#FAFAFA' }, '& td': { py: 1.5, borderColor: '#F3F4F6' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography fontSize="1.2rem">{row.icon}</Typography>
                      <Typography variant="body2" fontWeight={600}>{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{row.lab}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="primary.main" fontWeight={600}>{row.context}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="primary.main" fontWeight={600}>{row.input}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: '#D97706' }} fontWeight={600}>{row.output}</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ width: 20, height: 20, borderRadius: '4px', bgcolor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckIcon sx={{ fontSize: '0.9rem', color: '#059669' }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    {row.speed === 'fastest' ? (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <BoltIcon sx={{ fontSize: '0.9rem', color: '#D97706' }} />
                        <Typography variant="caption" fontWeight={600} color="#D97706">Fastest</Typography>
                      </Box>
                    ) : row.speed === 'fast' ? (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.65rem', color: '#059669' }} />
                        <Typography variant="caption" fontWeight={600} color="#059669">Fast</Typography>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <FiberManualRecordIcon sx={{ fontSize: '0.65rem', color: '#D97706' }} />
                        <Typography variant="caption" fontWeight={600} color="#D97706">Moderate</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{row.bestFor}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* ── TRENDING THIS WEEK ── */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight={700}>🔥 Trending This Week</Typography>
            <Button component={Link} href="/discover" variant="text" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>View research feed →</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2.5, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 5 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 3 } }}>
            {trendingItems.map((item, i) => (
              <Paper key={i} variant="outlined" sx={{ minWidth: 260, maxWidth: 260, flexShrink: 0, p: 3, borderRadius: 3, bgcolor: 'white', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', transform: 'translateY(-2px)' } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Chip label={item.badge} size="small" sx={{ bgcolor: item.badgeColor, color: item.badgeText, fontWeight: 600, fontSize: '0.65rem', height: 20 }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{item.provider}</Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1} lineHeight={1.3}>{item.title}</Typography>
                <Typography variant="caption" color="text.secondary" lineHeight={1.6} display="block">{item.desc}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FIND MODELS BY BUDGET ── */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight={700} mb={4}>Find Models by Budget</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {budgetTiers.map((tier) => (
            <Paper key={tier.label} elevation={0} component={Link} href="/marketplace" sx={{ p: 4, borderRadius: 4, bgcolor: tier.bgColor, display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' } }}>
              <Typography fontSize="1.8rem" mb={2}>{tier.icon}</Typography>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: tier.color }} mb={1} lineHeight={1.3}>{tier.label}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }} mb={3}>{tier.desc}</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: tier.color }}>{tier.count} models available →</Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* ── QUICK-START BY USE CASE ── */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={4}>Quick-Start by Use Case</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {useCases.map((uc, i) => (
              <Paper key={i} variant="outlined" component={Link} href="/marketplace" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'flex-start', gap: 2, textDecoration: 'none', color: 'inherit', transition: '0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                <Typography fontSize="1.6rem" flexShrink={0}>{uc.icon}</Typography>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} mb={0.5}>{uc.name}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1} lineHeight={1.5}>{uc.models}</Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ color: 'primary.main' }}>{uc.cta}</Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── DARK NEWSLETTER ── */}
      <Box sx={{ bgcolor: '#1A1A1A', py: 10, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="overline" sx={{ color: '#C2612E', fontWeight: 700, letterSpacing: 2 }}>STAY AHEAD OF THE CURVE</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mt: 2, mb: 2, lineHeight: 1.2 }}>
            New models drop every week.<br />Don&apos;t miss a release.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Get a curated weekly digest: new model releases, benchmark comparisons, pricing changes, and prompt engineering tips — straight to your inbox.
          </Typography>
          <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ display: 'flex', gap: 1.5, maxWidth: 440, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="your@email.com"
              type="email"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                },
                '& input::placeholder': { color: 'rgba(255,255,255,0.4)' },
              }}
            />
            <Button type="submit" variant="contained" disableElevation sx={{ borderRadius: 6, px: 3, whiteSpace: 'nowrap', background: 'linear-gradient(180deg, #D16E38 0%, #A85227 100%)', color: 'white', fontWeight: 600 }}>
              Subscribe free →
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', mt: 2, display: 'block' }}>
            No spam. Unsubscribe any time. Trusted by 82K+ builders.
          </Typography>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ borderTop: '1px solid #2A2A2A', py: 3, bgcolor: '#1A1A1A' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>NexusAI Model Marketplace</Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {['Models', 'Research', 'API', 'Privacy', 'Terms'].map((link) => (
              <Typography key={link} variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', cursor: 'pointer', '&:hover': { color: 'white' } }}>{link}</Typography>
            ))}
          </Box>
        </Container>
      </Box>

      <Dialog open={onboardingOpen} onClose={() => setOnboardingOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 4 }}>
          {onboardingStep === 'welcome' && (
            <Box>
              <Typography variant="h5" fontWeight={800} mb={1}>
                {t('onboarding.welcomeTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }} mb={3}>
                {t('onboarding.welcomeBody')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" onClick={() => setOnboardingStep('question')} sx={{ borderRadius: 3, textTransform: 'none' }}>
                  {t('onboarding.getStarted')}
                </Button>
                <Button variant="text" onClick={goToHub} sx={{ textTransform: 'none' }}>
                  {t('onboarding.skip')}
                </Button>
              </Stack>
            </Box>
          )}

          {onboardingStep === 'question' && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={1}>
                {t('onboarding.quickQuestion')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5}>
                {t('onboarding.quickPrompt')}
              </Typography>
              <Stack spacing={1.2} mb={3}>
                {['Create content', 'Build an AI agent', 'Analyze data', 'Generate images'].map((choice) => (
                  <Button
                    key={choice}
                    variant={quickChoice === choice ? 'contained' : 'outlined'}
                    onClick={() => setQuickChoice(choice)}
                    sx={{ borderRadius: 3, textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    {choice}
                  </Button>
                ))}
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  disabled={!quickChoice}
                  onClick={async () => {
                    if (quickChoice) {
                      appendToInput(quickChoice);
                      try {
                        const result = await generateOnboardingPrompt(quickChoice);
                        setGeneratedPrompt(result.generatedPrompt);
                        if (clientSessionId) {
                          await saveOnboarding(quickChoice, clientSessionId);
                        }
                      } catch {
                        setGeneratedPrompt(quickChoice);
                      }
                      setOnboardingStep('done');
                    }
                  }}
                  sx={{ borderRadius: 3, textTransform: 'none' }}
                >
                  {t('onboarding.continue')}
                </Button>
                <Button variant="text" onClick={goToHub} sx={{ textTransform: 'none' }}>
                  {t('onboarding.skipSearch')}
                </Button>
              </Stack>
            </Box>
          )}

          {onboardingStep === 'done' && (
            <Box textAlign="center">
              <Typography variant="h4" mb={1}>🎉</Typography>
              <Typography variant="h6" fontWeight={800} mb={1}>
                {t('onboarding.doneTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {t('onboarding.doneBody')}
              </Typography>
              <Button variant="contained" onClick={goToHub} sx={{ borderRadius: 3, textTransform: 'none' }}>
                {t('onboarding.goToHub')}
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
