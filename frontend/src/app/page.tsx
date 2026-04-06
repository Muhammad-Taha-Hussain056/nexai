'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Container, Paper, TextField,
  IconButton, Chip, Button, Stack, Dialog, DialogContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  List, ListItemButton, ListItemIcon, ListItemText, Snackbar, Alert
} from '@mui/material';
import Navbar from '../components/layout/Navbar';
import ModelCard from '../components/marketplace/ModelCard';
import modelsData from '../data/models.json';
import MicNoneIcon from '@mui/icons-material/MicNone';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import BoltIcon from '@mui/icons-material/Bolt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { generateOnboardingPrompt, saveOnboarding } from '@/lib/api';
import { useLanguage } from '@/i18n/LanguageProvider';
import { fetchAllModels, fetchAgents, FoundationModel, Agent } from '@/services/modelService';

// ── Types for Voice Recognition ──────────────────────────────────────────────

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

// ── Mock Data for Sections ───────────────────────────────────────────────────

const stats = [
  { value: '525+', label: 'AI Models' },
  { value: '82K', label: 'Builders' },
  { value: '28', label: 'AI Labs' },
  { value: '4.8 ⭐', label: 'Avg Rating' },
];

const comparisonRows = [
  { icon: '🧠', name: 'GPT-5.4', lab: 'OpenAI', context: '1.05M', input: '$2.50', output: '$15', multimodal: true, speed: 'fast', bestFor: 'High-precision professional tasks' },
  { icon: '👑', name: 'Claude Opus 4.6', lab: 'Anthropic', context: '200K/1M β', input: '$5', output: '$25', multimodal: true, speed: 'moderate', bestFor: 'Agents, advanced coding' },
  { icon: '⚡', name: 'Claude Sonnet 4.6', lab: 'Anthropic', context: '200K/1M β', input: '$3', output: '$15', multimodal: true, speed: 'fast', bestFor: 'Code, data, content at scale' },
  { icon: '🔭', name: 'Gemini 3.1 Pro', lab: 'Google', context: '2M–5M', input: '$2', output: '$12', multimodal: true, speed: 'moderate', bestFor: 'Deep reasoning, long context' },
];

const trendingItems = [
  { id: 'google-gemini-2-5-pro-sota-2026-03-26', badge: 'Just Released', badgeColor: '#E0F2F1', badgeText: '#00695C', provider: 'Google DeepMind', title: 'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks', desc: 'Scores 83.2% on AIME 2025 math competition, outperforming prior models on reasoning-intensive tasks.' },
  { id: 'claude-opus-4-6-release', badge: 'Hot', badgeColor: '#FFF4ED', badgeText: '#C2612E', provider: 'Anthropic', title: 'Claude Opus 4.6 — Thought Signatures', desc: 'Thought Signatures bring new transparency to deep reasoning. 5M context window.' },
  { id: 'gpt-5-4-computer-use', badge: 'Computer Use', badgeColor: '#F3E8FF', badgeText: '#7C3AED', provider: 'OpenAI', title: 'GPT-5.4 — Native Computer-Use Agents', desc: 'GPT-5.4 introduces native computer-use agents, letting it operate browsers autonomously.' },
];

const budgetTiers = [
  { icon: '🆓', label: 'Free & Open Source', color: '#059669', bgColor: '#ECFDF5', desc: 'Llama 4, DeepSeek-V3 — self-host with zero API cost.', count: 6 },
  { icon: '💎', label: 'Budget – Under $0.50/1M', color: '#1A73E8', bgColor: '#EFF6FF', desc: 'Gemini 3.1 Flash-Lite, Nemotron Nano — best value.', count: 9 },
  { icon: '⚖️', label: 'Mid-Range – $1–$5/1M', color: '#B45309', bgColor: '#FFFBEB', desc: 'Claude Sonnet 4.6, GPT-5.4, Qwen3-Max.', count: 11 },
  { icon: '🏆', label: 'Premium – $5+/1M', color: '#C2612E', bgColor: '#FFF4ED', desc: 'Claude Opus 4.6, Sora 2 Pro — top-tier quality.', count: 5 },
];

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  
  const [featuredModels, setFeaturedModels] = useState<FoundationModel[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroInput, setHeroInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'question' | 'done'>('welcome');
  const [quickChoice, setQuickChoice] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [clientSessionId, setClientSessionId] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const existing = window.localStorage.getItem('nexus_session_id');
    if (!existing) {
      const created = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem('nexus_session_id', created);
      setClientSessionId(created);
    } else {
      setClientSessionId(existing);
    }

    async function loadData() {
      try {
        const [modelsRes, agentsRes] = await Promise.all([
          fetchAllModels(),
          fetchAgents().catch(() => ({ agents: [] }))
        ]);
        
        if (modelsRes && modelsRes.models) {
          setFeaturedModels(modelsRes.models.slice(0, 3));
        }
        if (agentsRes && agentsRes.agents) {
          setAgents(agentsRes.agents.slice(0, 4));
        }
      } catch (err) {
        console.error("Home data fetch fail:", err);
        const localModels = modelsData.slice(0, 3) as any[];
        setFeaturedModels(localModels);
        setAgents([
          { id: '1', name: 'Research Agent', description: 'Deep web research and reporting.', emoji: '🔍', tags: ['Web search'] },
          { id: '2', name: 'Support Agent', description: 'Autonomous customer support.', emoji: '💼', tags: ['Ticketing'] },
          { id: '3', name: 'Code Review Agent', description: 'PR reviews and bug discovery.', emoji: '💻', tags: ['GitHub'] },
          { id: '4', name: 'Data Analysis Agent', description: 'Statistical analysis and charts.', emoji: '📊', tags: ['Sheets'] },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
      appendToInput('[Voice not supported]');
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
    <Box sx={{ pb: 8, bgcolor: '#FAFAFA' }}>
      <Navbar />

      {/* ── HERO ── */}
      <Container maxWidth="md" sx={{ textAlign: 'center', pt: { xs: 10, md: 14 }, pb: 6 }}>
        <Box display="inline-block" mb={4}>
          <Chip
            label="• 525 models live · Updated daily"
            sx={{ 
              bgcolor: 'white', 
              color: '#BF6132', 
              fontWeight: 700, 
              border: '1px solid rgba(191, 97, 50, 0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              '& .MuiChip-label': { px: 2 } 
            }}
          />
        </Box>

        <Box sx={{ mt: 2, mb: 6 }}>
          <Typography variant="h1" sx={{ fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.05, fontSize: { xs: '3.5rem', md: '5.5rem' }, color: '#111827' }}>
            Find your perfect <br />
            <Box component="span" sx={{ 
              background: 'linear-gradient(90deg, #D46F35 0%, #B3511D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI model</Box>
            <br />
            with guided discovery
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 4, fontWeight: 500, fontSize: '1.25rem', maxWidth: 640, mx: 'auto', lineHeight: 1.6 }}>
            The benchmark for AI reliability. Discover, compare, and deploy models from OpenAI, Anthropic, Google, and more.
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 840, mx: 'auto', mb: 8, position: 'relative' }}>
          <input ref={fileInputRef} type="file" hidden multiple onChange={(e) => handlePickerFile(e, 'File')} />
          <input ref={videoInputRef} type="file" hidden multiple accept="video/*" onChange={(e) => handlePickerFile(e, 'Video')} />
          <input ref={imageInputRef} type="file" hidden multiple accept="image/*" onChange={(e) => handlePickerFile(e, 'Image')} />
          
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '32px',
              bgcolor: 'white',
              border: '1px solid #E5E7EB',
              boxShadow: '0 30px 60px -12px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:focus-within': { borderColor: '#D46F35', boxShadow: '0 30px 60px -12px rgba(212,111,53,0.12)' }
            }}
          >
            <TextField
              fullWidth
              placeholder="What do you want to build today?"
              variant="standard"
              value={heroInput}
              onChange={(e) => setHeroInput(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { px: 1, py: 1, fontSize: '1.2rem', color: '#111827', fontWeight: 600 }
              }}
            />
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ pl: 1 }}>
                <IconButton size="small" onClick={handleVoiceInput} sx={{ width: 40, height: 40, bgcolor: '#F3E8FF', color: '#9333EA', '&:hover': { bgcolor: '#E9D5FF' } }}>
                  {isListening ? <FiberManualRecordIcon sx={{ fontSize: '0.8rem', color: 'red', animation: 'pulse 1s infinite' }} /> : <MicNoneIcon fontSize="small" />}
                </IconButton>
                <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ width: 40, height: 40, bgcolor: '#FEF3C7', color: '#D97706', '&:hover': { bgcolor: '#FDE68A' } }}>
                  <AttachFileIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => imageInputRef.current?.click()} sx={{ width: 40, height: 40, bgcolor: '#EFF6FF', color: '#2563EB', '&:hover': { bgcolor: '#DBEAFE' } }}>
                  <ImageOutlinedIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => videoInputRef.current?.click()} sx={{ width: 40, height: 40, bgcolor: '#FEE2E2', color: '#DC2626', '&:hover': { bgcolor: '#FECACA' } }}>
                  <VideoCallOutlinedIcon fontSize="small" />
                </IconButton>
                <Box sx={{ width: '1px', height: 28, bgcolor: '#E5E7EB', mx: 1 }} />
                <Button size="small" variant="contained" disableElevation component={Link} href="/agents" sx={{ bgcolor: '#F3F4F6', color: '#374151', borderRadius: 4, textTransform: 'none', px: 2.5, py: 0.75, fontWeight: 700, '&:hover': { bgcolor: '#E5E7EB' } }} startIcon={<SmartToyIcon fontSize="small" />}>
                  Agent
                </Button>
              </Stack>
              
              <Button onClick={openOnboarding} variant="contained" disableElevation startIcon={<SearchIcon />} sx={{ borderRadius: 999, py: 1.5, px: 4, textTransform: 'none', fontSize: '1rem', fontWeight: 800, bgcolor: '#D46F35', color: 'white', '&:hover': { bgcolor: '#B3511D' } }}>
                Let's go
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', mt: 4 }}>
          {stats.map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={900} color="#111827" lineHeight={1}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={800} mt={1.5} display="block" sx={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ── FEATURED MODELS ── */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <Box>
              <Typography variant="h4" fontWeight={900} letterSpacing="-1px">Premium Foundation Models</Typography>
              <Typography variant="body1" color="text.secondary" mt={0.5}>Access the world&apos;s most capable AI engines from a single portal.</Typography>
            </Box>
            <Button component={Link} href="/marketplace" variant="outlined" sx={{ borderRadius: 6, borderColor: '#E5E7EB', color: '#111827', fontWeight: 700, textTransform: 'none', px: 3, py: 1, '&:hover': { bgcolor: 'white', borderColor: '#D46F35', color: '#D46F35' } }}>{t('home.browseAll')}</Button>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {loading ? (
               [1,2,3].map(i => <Paper key={i} sx={{ height: 320, borderRadius: 3, bgcolor: '#F3F4F6', animate: 'pulse' }} />)
            ) : featuredModels.map((model) => (
              <Box key={model.id}>
                <ModelCard model={model} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── BROWSE BY AI AGENT ── */}
      <Box sx={{ bgcolor: 'white', py: 12 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <Box>
              <Typography variant="h4" fontWeight={900} letterSpacing="-1px">Ready-to-Deploy AI Agents</Typography>
              <Typography variant="body1" color="text.secondary" mt={0.5}>Pre-configured blueprints for complex autonomous tasks.</Typography>
            </Box>
            <Button component={Link} href="/agents" variant="text" sx={{ color: '#D46F35', fontWeight: 800, textTransform: 'none' }}>Explore all blueprints →</Button>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {agents.map((agent) => (
              <Paper 
                key={agent.id} 
                variant="outlined" 
                component={Link} 
                href="/agents" 
                sx={{ 
                  p: 4, 
                  borderRadius: 5, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start', 
                  cursor: 'pointer', 
                  textDecoration: 'none', 
                  color: 'inherit', 
                  transition: 'all 0.3s ease', 
                  border: '1px solid #F3F4F6',
                  '&:hover': { borderColor: '#D46F35', boxShadow: '0 20px 40px -10px rgba(212,111,53,0.1)', transform: 'translateY(-6px)' } 
                }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#FFF4ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', mb: 3 }}>
                  {agent.emoji}
                </Box>
                <Typography variant="h6" fontWeight={800} mb={1.5} color="#111827">{agent.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }} mb={3}>
                  {agent.description}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {agent.tags?.map(tag => (
                    <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#F9FAFB', fontWeight: 700, color: 'text.secondary', border: '1px solid #E5E7EB' }} />
                  ))}
                </Stack>
              </Paper>
            ))}
            
            <Paper 
              variant="outlined" 
              component={Link}
              href="/agents"
              sx={{ 
                p: 4, 
                borderRadius: 5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: '#FAFAFA',
                border: '2px dashed #E5E7EB',
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': { borderColor: '#D46F35', bgcolor: '#FFF4ED' }
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: '2rem', color: '#D46F35', mb: 2 }} />
              <Typography variant="subtitle1" fontWeight={800} color="#111827">Build Custom Agent</Typography>
              <Typography variant="caption" color="text.secondary" mt={1}>Create your own blueprint from scratch.</Typography>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* ── FLAGSHIP MODEL COMPARISON ── */}
      <Container maxWidth="xl" sx={{ py: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={1}>
          <Typography variant="h4" fontWeight={900} color="#111827">Flagship Models</Typography>
          <Button component={Link} href="/marketplace" variant="text" sx={{ color: '#D46F35', fontWeight: 800, textTransform: 'none' }}>Full Specs →</Button>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={4}>Live performance and pricing data for the top models in each category.</Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #F3F4F6' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {['MODEL', 'LAB', 'CONTEXT', 'INPUT $/1M', 'OUTPUT $/1M', 'SPEED', 'BEST FOR'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.08em', color: '#6B7280', py: 2 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.name} sx={{ '&:hover': { bgcolor: '#FAFAFA' }, '& td': { py: 2.5, borderColor: '#F3F4F6' } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography fontSize="1.4rem">{row.icon}</Typography>
                      <Typography variant="body2" fontWeight={800} color="#111827">{row.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="#4B5563" fontWeight={500}>{row.lab}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="#D46F35" fontWeight={700}>{row.context}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="#111827" fontWeight={700}>{row.input}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="#B3511D" fontWeight={700}>{row.output}</Typography></TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <BoltIcon sx={{ fontSize: '1rem', color: '#10B981' }} />
                      <Typography variant="caption" fontWeight={700} color="#10B981" sx={{ textTransform: 'uppercase' }}>{row.speed}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="#6B7280" fontWeight={500}>{row.bestFor}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* ── TRENDING THIS WEEK ── */}
      <Box sx={{ bgcolor: '#F9FAFB', py: 10 }}>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
            <Typography variant="h4" fontWeight={900} color="#111827">🔥 Trending News</Typography>
            <Typography 
              component={Link}
              href="/discover"
              variant="caption" 
              sx={{ color: 'text.secondary', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', '&:hover': { color: '#111827' } }}
            >
              VIEW ALL &gt;
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {trendingItems.map((item, i) => (
              <Paper 
                key={i} 
                variant="outlined" 
                component={Link}
                href={`/discover?id=${item.id}`}
                sx={{ p: 4, borderRadius: 1, bgcolor: 'white', transition: '0.2s', textDecoration: 'none', color: 'inherit', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.04)' } }}
              >
                <Chip label={item.badge} size="small" sx={{ bgcolor: item.badgeColor, color: item.badgeText, fontWeight: 800, fontSize: '0.7rem', mb: 2, borderRadius: 1 }} />
                <Typography variant="h6" fontWeight={800} mb={1.5} color="#111827" lineHeight={1.3}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{item.desc}</Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FIND MODELS BY BUDGET ── */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Typography variant="h4" fontWeight={900} mb={6} color="#111827">Find Models by Budget</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {budgetTiers.map((tier) => (
            <Paper key={tier.label} elevation={0} component={Link} href="/marketplace" sx={{ p: 4, borderRadius: 3, bgcolor: tier.bgColor, display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' } }}>
              <Typography fontSize="2.4rem" mb={2}>{tier.icon}</Typography>
              <Typography variant="h6" fontWeight={900} sx={{ color: tier.color }} mb={1}>{tier.label}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }} mb={4}>{tier.desc}</Typography>
              <Typography variant="subtitle2" fontWeight={800} sx={{ color: tier.color, display: 'flex', alignItems: 'center', gap: 1 }}>{tier.count} models available <Typography component="span">→</Typography></Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* ── DARK NEWSLETTER ── */}
      <Box sx={{ bgcolor: '#0F172A', py: 12, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="overline" sx={{ color: '#D46F35', fontWeight: 900, letterSpacing: 2 }}>STAY AHEAD</Typography>
          <Typography variant="h3" fontWeight={900} sx={{ color: 'white', mt: 2, mb: 3, lineHeight: 1.1 }}>
            New models drop weekly.<br />Don&apos;t miss a beat.
          </Typography>
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 5, fontSize: '1.1rem', lineHeight: 1.6 }}>
            Join 82,000+ developers getting the weekly NexusAI report on model releases, tests, and pricing drops.
          </Typography>
          <Box component="form" onSubmit={(e) => { e.preventDefault(); setSubscribeSuccess(true); }} sx={{ display: 'flex', gap: 1.5, maxWidth: 480, mx: 'auto', p: 1, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <TextField
              fullWidth
              placeholder="Enter your email"
              type="email"
              variant="standard"
              required
              InputProps={{
                disableUnderline: true,
                sx: { color: 'white', px: 2, py: 1, '& input::placeholder': { color: '#64748B', opacity: 1 } }
              }}
            />
            <Button type="submit" variant="contained" disableElevation sx={{ borderRadius: '14px', px: 4, bgcolor: '#D46F35', color: 'white', fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#B3511D' } }}>
              Subscribe
            </Button>
          </Box>
          <Typography variant="caption" sx={{ color: '#64748B', mt: 3, display: 'block', fontWeight: 600 }}>
            No spam. Ever. One click unsubscribe.
          </Typography>
        </Container>
      </Box>

      {/* ── FOOTER ── */}
      <Box sx={{ bgcolor: '#0F172A', py: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ width: 32, height: 32, bgcolor: '#D46F35', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white' }}>N</Box>
            <Typography variant="body1" fontWeight={800} color="white">NexusAI</Typography>
          </Box>
          <Stack direction="row" spacing={4}>
            {['Models', 'Research', 'Pricing', 'API', 'Legal'].map((link) => (
              <Typography 
                key={link} 
                variant="body2" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{ color: '#94A3B8', fontWeight: 600, cursor: 'pointer', '&:hover': { color: 'white' } }}
              >
                {link}
              </Typography>
            ))}
          </Stack>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>© 2026 NexusAI Inc. Built for the future of reasoning.</Typography>
        </Container>
      </Box>

      {/* ── ONBOARDING MODAL ── */}
      <Dialog open={onboardingOpen} onClose={() => setOnboardingOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6 } }}>
        <DialogContent sx={{ p: 5 }}>
          {onboardingStep === 'welcome' && (
            <Box>
              <Typography variant="h4" fontWeight={900} mb={2} color="#111827">
                Welcome to NexusAI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }} mb={4}>
                We help you find the absolute best AI model for your specific needs, whether it&apos;s for coding, creative writing, or complex data analysis.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" disableElevation onClick={() => setOnboardingStep('question')} sx={{ borderRadius: 3, textTransform: 'none', px: 4, py: 1.2, bgcolor: '#D46F35', fontWeight: 800 }}>
                  Get Started
                </Button>
                <Button variant="text" onClick={goToHub} sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280' }}>
                  Skip
                </Button>
              </Stack>
            </Box>
          )}

          {onboardingStep === 'question' && (
            <Box>
              <Typography variant="h5" fontWeight={900} mb={1} color="#111827">
                What are you building?
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Select a category to help us narrow down the best models for you.
              </Typography>
              <Stack spacing={1.5} mb={4}>
                {['Creative content', 'Software agent', 'Business analysis', 'Visual assets'].map((choice) => (
                  <Button
                    key={choice}
                    variant={quickChoice === choice ? 'contained' : 'outlined'}
                    onClick={() => setQuickChoice(choice)}
                    sx={{ 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      justifyContent: 'flex-start', 
                      py: 1.5, 
                      px: 3,
                      fontWeight: 700,
                      borderColor: quickChoice === choice ? '#D46F35' : '#E5E7EB',
                      bgcolor: quickChoice === choice ? '#D46F35' : 'transparent',
                      color: quickChoice === choice ? 'white' : '#111827',
                      '&:hover': { bgcolor: quickChoice === choice ? '#B3511D' : '#F9FAFB' }
                    }}
                  >
                    {choice}
                  </Button>
                ))}
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  disableElevation
                  disabled={!quickChoice}
                  onClick={async () => {
                    if (quickChoice) {
                      try {
                        const result = await generateOnboardingPrompt(quickChoice);
                        setGeneratedPrompt(result.generatedPrompt);
                        if (clientSessionId) await saveOnboarding(quickChoice, clientSessionId);
                      } catch {
                        setGeneratedPrompt(quickChoice);
                      }
                      setOnboardingStep('done');
                    }
                  }}
                  sx={{ borderRadius: 3, textTransform: 'none', px: 4, py: 1.2, bgcolor: '#D46F35', fontWeight: 800 }}
                >
                  Continue
                </Button>
                <Button variant="text" onClick={goToHub} sx={{ textTransform: 'none', fontWeight: 700, color: '#6B7280' }}>
                  Skip Search
                </Button>
              </Stack>
            </Box>
          )}

          {onboardingStep === 'done' && (
            <Box textAlign="center">
              <Box sx={{ width: 80, height: 80, bgcolor: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                <CheckIcon sx={{ fontSize: '2.5rem', color: '#10B981' }} />
              </Box>
              <Typography variant="h5" fontWeight={900} mb={1} color="#111827">
                Model Ready
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                We&apos;ve analyzed your requirements and prepared a custom workspace with the best models for your task.
              </Typography>
              <Button variant="contained" disableElevation onClick={goToHub} sx={{ borderRadius: 3, textTransform: 'none', px: 6, py: 1.5, bgcolor: '#D46F35', fontWeight: 800 }}>
                Enter Workspace
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={subscribeSuccess} 
        autoHideDuration={5000} 
        onClose={() => setSubscribeSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSubscribeSuccess(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 3, fontWeight: 700 }}>
          You have subscribed successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
