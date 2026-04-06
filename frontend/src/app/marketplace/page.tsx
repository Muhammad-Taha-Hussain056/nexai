'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, InputAdornment, Button,
  Checkbox, FormControlLabel, Slider, Divider, Paper, Chip,
  Select, MenuItem, FormControl, Rating,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Navbar from '../../components/layout/Navbar';
import ModelCard from "../../components/marketplace/ModelCard";
import ModelDetailModal from "../../components/marketplace/ModelDetailModal";
import modelsData from "../../data/models_catalog.json";
import { useStore } from "../../store/useStore";
import Link from "next/link";
import { fetchAllModels } from "@/services/modelService";

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

const labsConfig = [
  { emoji: '🧠', name: 'OpenAI' },
  { emoji: '👑', name: 'Anthropic' },
  { emoji: '💎', name: 'Google' },
  { emoji: '🦙', name: 'Meta' },
  { emoji: '🌬️', name: 'Mistral' },
  { emoji: '📡', name: 'Cohere' },
];

const categories = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Open Source'];
const licenseTypes = ['Commercial', 'Open Source', 'Research Only', 'Enterprise'];

export default function Marketplace() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useStore();
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<FoundationModel | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  const [allModels, setAllModels] = useState<FoundationModel[]>(
    modelsData.models as FoundationModel[],
  );

  const providers = ["OpenAI", "Anthropic", "Google", "Meta", "Mistral", "Cohere"];
  const [selectedProviders, setSelectedProviders] = useState<string[]>(providers);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([
    "Pay-per-use", "Subscription", "Free tier", "Enterprise",
  ]);

  useEffect(() => {
    async function loadModels() {
      try {
        const data = await fetchAllModels();
        if (data && data.models) {
          setAllModels(data.models as FoundationModel[]);
        }
      } catch (err) {
        console.error("Backend fetch failed, using fallback models catalog.", err);
      }
    }
    void loadModels();
  }, []);

  const toggleProvider = (p: string) =>
    setSelectedProviders((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  const togglePricing = (p: string) =>
    setSelectedPricing((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  const filteredModels = allModels.filter((m) => {
    const searchLower = searchQuery.toLowerCase();
    const modelNameLower = m.model.toLowerCase();
    const modelDescLower = m.description.toLowerCase();
    const modelProviderLower = m.provider.toLowerCase();

    const matchesSearch = modelNameLower.includes(searchLower) || modelDescLower.includes(searchLower);
    const matchesProviderFilter = selectedProviders.some(p => p.toLowerCase() === modelProviderLower);
    const matchesLab = activeLab === null || activeLab.toLowerCase() === modelProviderLower;
    const matchesRating = m.rating >= minRating;
    const matchesCategory = activeCategory === "All" || (m.tags && m.tags.some((tag) => tag.toLowerCase() === activeCategory.toLowerCase()));

    return matchesSearch && matchesLab && matchesRating && matchesProviderFilter && matchesCategory;
  });

  const sortedModels = [...filteredModels].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    if (sortBy === 'name') return a.model.localeCompare(b.model);
    return b.reviewCount - a.reviewCount;
  });

  // Dynamic counts for labs
  const labCounts = allModels.reduce((acc, m) => {
    const p = m.provider.toLowerCase();
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dynamicLabs = labsConfig.map(lab => ({
    ...lab,
    count: labCounts[lab.name.toLowerCase()] || 0
  }));

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F9FAFB' }}>
      <Navbar />

      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB', pt: 10, pb: 0 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 1.5, alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={900} sx={{ flexShrink: 0, letterSpacing: '-0.5px' }}>
              Marketplace
            </Typography>
            <TextField
              fullWidth
              placeholder={`Search ${allModels.length} models, capabilities or providers...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: '#F3F4F6', '& fieldset': { border: 'none' } }
              }}
              size="small"
            />
            <Button variant="contained" disableElevation startIcon={<AutoAwesomeIcon />}
              sx={{ borderRadius: 3, px: 3, bgcolor: '#BF6132', textTransform: 'none', fontWeight: 700, flexShrink: 0, '&:hover': { bgcolor: '#A34818' } }}>
              AI Assistant
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 4, mt: 1 }}>
            {categories.map((cat) => (
              <Box key={cat} onClick={() => setActiveCategory(cat)}
                sx={{ py: 1.5, px: 1, cursor: 'pointer', borderBottom: '2px solid', 
                  borderColor: activeCategory === cat ? '#BF6132' : 'transparent',
                  color: activeCategory === cat ? '#BF6132' : 'text.secondary',
                  fontWeight: activeCategory === cat ? 700 : 500, fontSize: '0.875rem', transition: 'all 0.2s',
                  '&:hover': { color: '#BF6132' } }}>
                {cat}
              </Box>
            ))}
          </Box>
        </Container>
        
        <Box sx={{ borderTop: '1px solid #F3F4F6', px: 3, py: 1.25 }}>
          <Box sx={{ display: 'flex', gap: 0.75, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' }, alignItems: 'center' }}>
            <Button size="small" disableElevation onClick={() => setActiveLab(null)}
              sx={{ borderRadius: 5, px: 2, textTransform: 'none', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap',
                ...(activeLab === null 
                    ? { bgcolor: '#BF6132', color: 'white', border: '1px solid #BF6132', '&:hover': { bgcolor: '#A34818' } } 
                    : { color: 'text.secondary', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }) }}>
              All Models ({allModels.length})
            </Button>
            {dynamicLabs.map((lab) => (
              <Button key={lab.name} size="small" onClick={() => setActiveLab((p) => p === lab.name ? null : lab.name)}
                sx={{ borderRadius: 5, px: 2, textTransform: 'none', fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap',
                  ...(activeLab === lab.name
                    ? { border: '1px solid #BF6132', color: '#BF6132', bgcolor: '#FFF4ED' }
                    : { color: 'text.secondary', border: '1px solid transparent', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }) }}>
                {lab.emoji} {lab.name} ({lab.count})
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex', gap: 4 }}>
        <Box sx={{ width: 240, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
          <Paper variant="outlined" component={Link} href="/chat" sx={{ p: 2.5, mb: 3, bgcolor: '#FFF4ED', borderColor: '#F9D8C8', borderRadius: 1, display: 'block', textDecoration: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(194,97,46,0.1)' } }}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <AutoAwesomeIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
              <Typography variant="body2" fontWeight={700} color="primary.main">Need help choosing?</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Chat with our AI guide for a personalised recommendation.
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
            <Slider value={maxPrice} onChange={(_, v) => setMaxPrice(v as number)} min={0} max={200} size="small" valueLabelDisplay="auto" sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="body2" color="text.secondary" mb={3}>Up to ${maxPrice}</Typography>
          <Divider sx={{ mb: 3 }} />

          <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ letterSpacing: '0.08em', display: 'block', mb: 1.5 }}>MIN RATING</Typography>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Rating value={minRating} onChange={(_, v) => setMinRating(v ?? 0)} size="small" sx={{ color: '#FBBF24' }} />
            <Typography variant="caption" color="text.secondary">{minRating > 0 ? `${minRating}+` : 'Any'}</Typography>
          </Box>
          
          <Button fullWidth variant="outlined" size="small" onClick={() => { setActiveLab(null); setSearchQuery(''); setActiveCategory('All'); setMinRating(0); setMaxPrice(200); setSortBy('popular'); }}
            sx={{ borderRadius: 3, borderColor: '#E5E7EB', color: 'text.secondary', textTransform: 'none', '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
            Reset all
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
             <Typography variant="body2" color="text.secondary">
                Showing <strong style={{ color: '#111' }}>{sortedModels.length}</strong> of {allModels.length} models
             </Typography>
             <FormControl size="small">
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 2, bgcolor: 'white', minWidth: 160, fontSize: '0.85rem' }}>
                    <MenuItem value="popular">Most Popular</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                </Select>
             </FormControl>
          </Box>

          {sortedModels.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 16 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>No matches found</Typography>
              <Button variant="contained" disableElevation onClick={() => { setActiveLab(null); setSearchQuery(''); setActiveCategory('All'); }} sx={{ borderRadius: 3, bgcolor: '#BF6132', mt: 2 }}>
                Clear Filters
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
