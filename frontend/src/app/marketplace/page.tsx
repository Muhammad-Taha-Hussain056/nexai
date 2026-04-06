'use client';

import React, { useState } from 'react';
import {
  Box, Container, Typography, TextField, InputAdornment, Button,
  Checkbox, FormControlLabel, Slider, Divider, Paper, Chip,
  Select, MenuItem, FormControl, Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Navbar from '../../components/layout/Navbar';
import ModelCard from '../../components/marketplace/ModelCard';
import ModelDetailModal from '../../components/marketplace/ModelDetailModal';
import modelsData from '../../data/models_catalog.json';
import { useStore } from '../../store/useStore';
import Link from 'next/link';

export interface FoundationModel {
  id: string;
  provider: string;
  model: string;
  description: string;
  inputOutput: {
    input: string[];
    output: string[];
    contextTokens: number;
    maxOutputTokens: number;
    avgLatencySeconds: number;
  };
  benchmarks: {
    mmlu: number;
    humanEval: number;
    math: number;
  };
  rating: number;
  reviewCount: number;
  reviewBreakdown: Record<string, string>;
  reviews: Array<{
    author: string;
    role: string;
    stars: number;
    date: string;
    text: string;
  }>;
  agents: {
    supported: boolean;
    creationSteps: string[];
  };
  pricing: {
    payPerUse: { inputPer1M: string; outputPer1M: string; context: string; rateLimit: string; };
    pro: { monthly: string; inputPer1M: string; outputPer1M: string; context: string; rateLimit: string; };
    enterprise: { plan: string; notes?: string[]; };
    freeTier?: string;
  };
  howToUse: string[];
  tags: string[];
}

const labs = [
  { emoji: '🧠', name: 'OpenAI', count: 9 },
  { emoji: '👑', name: 'Anthropic', count: 3 },
  { emoji: '💎', name: 'Google', count: 4 },
  { emoji: '🦙', name: 'Meta', count: 4 },
  { emoji: '🌬️', name: 'Mistral', count: 4 },
  { emoji: '📡', name: 'Cohere', count: 2 },
];

const categories = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Open Source'];

const licenseTypes = ['Commercial', 'Open Source', 'Research Only', 'Enterprise'];

export default function Marketplace() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useStore();
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<FoundationModel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  
  const providers = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'Cohere'];
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['OpenAI', 'Anthropic', 'Google', 'Meta']);
  const [selectedPricing, setSelectedPricing] = useState<string[]>(['Pay-per-use', 'Subscription', 'Free tier', 'Enterprise']);

  const toggleProvider = (p: string) =>
    setSelectedProviders((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  const togglePricing = (p: string) =>
    setSelectedPricing((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const sourceModels = modelsData.models as FoundationModel[];

  const filteredModels = sourceModels.filter((m) => {
    const matchesSearch = m.model.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simplistic provider/lab match ignoring case routing
    const friendlyProvider = m.provider.charAt(0).toUpperCase() + m.provider.slice(1);
    const matchesLab = activeLab === null || friendlyProvider === activeLab;
    const matchesRating = m.rating >= minRating;
    const matchesProvider = selectedProviders.includes(friendlyProvider);
    
    return matchesSearch && matchesLab && matchesRating && matchesProvider;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    if (sortBy === 'name') return a.model.localeCompare(b.model);
    return b.reviewCount - a.reviewCount; // popular default
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F4F2EE' }}>
      <Navbar />

      {/* ── STICKY SUBHEADER ── */}
      <Box sx={{ borderBottom: '1px solid #E5E7EB', bgcolor: 'rgba(255,255,255,0.92)', position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(10px)' }}>

        <Container maxWidth="xl" sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Typography variant="h5" fontWeight={800} letterSpacing="-0.5px" sx={{ flexShrink: 0 }}>
            Model Marketplace
          </Typography>

          <TextField
            size="small"
            placeholder="Search 525 models, capabilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} /></InputAdornment>,
              sx: { borderRadius: 6, bgcolor: 'white', width: 300 },
            }}
          />

          <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', flexGrow: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                size="small"
                onClick={() => setActiveCategory(cat)}
                disableElevation
                sx={{
                  borderRadius: 5, px: 2, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                  ...(activeCategory === cat
                    ? { bgcolor: '#1A1A1A', color: 'white', '&:hover': { bgcolor: '#333' } }
                    : { color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }),
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Box display="flex" alignItems="center" gap={2} sx={{ flexShrink: 0 }}>
            <Typography variant="body2" color="text.secondary">
              <strong style={{ color: '#1F2937' }}>{sortedModels.length}</strong> models
            </Typography>
            <FormControl size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 3, bgcolor: 'white', fontSize: '0.85rem', minWidth: 140 }}
              >
                <MenuItem value="popular">Most Popular</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="reviews">Most Reviewed</MenuItem>
                <MenuItem value="name">Name A–Z</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>

        <Box sx={{ borderTop: '1px solid #F3F4F6', px: 3, py: 1.25 }}>
          <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, alignItems: 'center' }}>
            <Button size="small" disableElevation onClick={() => setActiveLab(null)}
              sx={{ borderRadius: 5, px: 2, textTransform: 'none', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap',
                ...(activeLab === null ? { bgcolor: '#C2612E', color: 'white', '&:hover': { bgcolor: '#A34818' } } : { color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }) }}>
              All Labs
            </Button>
            {labs.map((lab) => (
              <Button key={lab.name} size="small" onClick={() => setActiveLab((p) => p === lab.name ? null : lab.name)}
                sx={{ borderRadius: 5, px: 2, textTransform: 'none', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap',
                  ...(activeLab === lab.name
                    ? { border: '1px solid #C2612E', color: '#C2612E', bgcolor: '#FFF4ED' }
                    : { color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }) }}>
                {lab.emoji} {lab.name} ({lab.count})
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex', gap: 4 }}>

        {/* LEFT SIDEBAR */}
        <Box sx={{ width: 240, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>

          <Paper variant="outlined" component={Link} href="/chat" sx={{ p: 2.5, mb: 3, bgcolor: '#FFF4ED', borderColor: '#F9D8C8', borderRadius: 3, display: 'block', textDecoration: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(194,97,46,0.1)' } }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <AutoAwesomeIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700} color="primary.main">Need help choosing?</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Chat with our AI guide for a personalised recommendation in 60 seconds.
            </Typography>
          </Paper>

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>PROVIDER</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            {providers.map((p) => (
              <FormControlLabel key={p} sx={{ m: 0, py: 0.3 }}
                control={<Checkbox checked={selectedProviders.includes(p)} onChange={() => toggleProvider(p)} size="small" sx={{ color: '#E5E7EB', '&.Mui-checked': { color: 'primary.main' } }} />}
                label={<Typography variant="body2" fontWeight={500}>{p}</Typography>}
              />
            ))}
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>PRICING MODEL</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            {['Pay-per-use', 'Subscription', 'Free tier', 'Enterprise'].map((p) => (
              <FormControlLabel key={p} sx={{ m: 0, py: 0.3 }}
                control={<Checkbox checked={selectedPricing.includes(p)} onChange={() => togglePricing(p)} size="small" sx={{ color: '#E5E7EB', '&.Mui-checked': { color: 'primary.main' } }} />}
                label={<Typography variant="body2" fontWeight={500}>{p}</Typography>}
              />
            ))}
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 2 }}>MAX PRICE/1M TOKENS</Typography>
          <Box sx={{ px: 0.5, mb: 1 }}>
            <Slider value={maxPrice} onChange={(_, v) => setMaxPrice(v as number)} min={0} max={200} size="small" valueLabelDisplay="auto" valueLabelFormat={(v) => `$${v}`} sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="body2" color="text.secondary" mb={3}>Up to ${maxPrice}</Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>MIN RATING</Typography>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Rating value={minRating} onChange={(_, v) => setMinRating(v ?? 0)} size="small" sx={{ color: '#FBBF24' }} />
            <Typography variant="caption" color="text.secondary">{minRating > 0 ? `${minRating}+` : 'Any'}</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1 }}>LICENSE TYPE</Typography>
          <Box display="flex" flexWrap="wrap" gap={0.75} mb={3}>
            {licenseTypes.map((l) => (
              <Chip key={l} label={l} size="small" onClick={() => {}} sx={{ borderRadius: 2, bgcolor: 'white', border: '1px solid #E5E7EB', fontWeight: 500, fontSize: '0.72rem', cursor: 'pointer', '&:hover': { bgcolor: '#FFF4ED', borderColor: 'primary.main', color: 'primary.main' } }} />
            ))}
          </Box>

          <Button fullWidth variant="outlined" size="small" onClick={() => { setActiveLab(null); setSearchQuery(''); setActiveCategory('All'); setMinRating(0); setMaxPrice(200); setSortBy('popular'); }}
            sx={{ borderRadius: 3, borderColor: '#E5E7EB', color: 'text.secondary', textTransform: 'none', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            Reset all filters
          </Button>
        </Box>

        {/* MODEL GRID */}
        <Box sx={{ flexGrow: 1 }}>
          {sortedModels.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 16 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>No models found</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>Try adjusting your search or filters.</Typography>
              <Button variant="contained" disableElevation onClick={() => { setActiveLab(null); setSearchQuery(''); setActiveCategory('All'); setMinRating(0); }} sx={{ borderRadius: 6, bgcolor: 'primary.main' }}>
                Clear all filters
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
              {sortedModels.map((model) => (
                <ModelCard key={model.id} model={model} onLearnMore={(m) => { setSelectedModel(m); setModalOpen(true); }} />
              ))}
            </Box>
          )}
        </Box>
      </Container>

      <ModelDetailModal model={selectedModel} open={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  );
}
