'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Avatar,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FoundationModel } from '../../app/marketplace/page';

interface ModelDetailModalProps {
  model: FoundationModel | null;
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index} id={`model-tab-${index}`} aria-labelledby={`model-tab-btn-${index}`}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
}

const providerIcons: Record<string, string> = {
  openai: '🌟',
  anthropic: '🎵',
  google: '🧠',
  meta: '🦙',
  mistral: '🌬️',
  cohere: '📡',
};

export default function ModelDetailModal({ model, open, onClose }: ModelDetailModalProps) {
  const [tab, setTab] = useState(0);

  if (!model) return null;

  const icon = providerIcons[model.provider.toLowerCase()] || '🤖';
  const friendlyProvider = model.provider.charAt(0).toUpperCase() + model.provider.slice(1);
  const contextStr = model.inputOutput?.contextTokens ? `${(model.inputOutput.contextTokens / 1000)}K tokens` : 'N/A';
  const priceStr = model.pricing?.payPerUse?.inputPer1M ? `${model.pricing.payPerUse.inputPer1M}/1M tk` : 'Custom';
  const speedStr = model.inputOutput?.avgLatencySeconds ? `${Math.round(1 / model.inputOutput.avgLatencySeconds * 100)} tok/s` : '~70 tok/s';

  const pricingTiers = [];
  if (model.pricing) {
    if (model.pricing.freeTier) {
      pricingTiers.push({
        name: 'Free Tier',
        price: '$0',
        period: '',
        color: '#059669',
        bgColor: '#ECFDF5',
        borderColor: '#A7F3D0',
        features: [model.pricing.freeTier, 'Community support', 'Standard API access'],
      });
    }
    if (model.pricing.payPerUse) {
      pricingTiers.push({
        name: 'Pay-per-use',
        price: model.pricing.payPerUse.inputPer1M,
        period: '/ 1M in',
        color: '#C2612E',
        bgColor: '#FFF4ED',
        borderColor: '#F9D8C8',
        features: [
          `${model.pricing.payPerUse.outputPer1M} / 1M out`,
          `${model.pricing.payPerUse.context} Context`,
          `Rate limit: ${model.pricing.payPerUse.rateLimit}`,
          'Pay as you go'
        ],
        highlighted: true,
      });
    }
    if (model.pricing.pro) {
      pricingTiers.push({
        name: 'Pro',
        price: model.pricing.pro.monthly,
        period: '/ month',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        features: [
          `Discounted: ${model.pricing.pro.inputPer1M} / 1M in`,
          `Discounted: ${model.pricing.pro.outputPer1M} / 1M out`,
          `Rate limit: ${model.pricing.pro.rateLimit}`,
          'Priority support'
        ]
      });
    }
    if (model.pricing.enterprise) {
      pricingTiers.push({
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        color: '#7C3AED',
        bgColor: '#F5F3FF',
        borderColor: '#DDD6FE',
        features: model.pricing.enterprise.notes || ['Custom SLA', 'Dedicated capacity', 'Volume discounts']
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="model-detail-title"
      PaperProps={{
        sx: { borderRadius: 4, maxHeight: '90vh' },
      }}
    >
      <Box
        sx={{
          px: 4,
          pt: 4,
          pb: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'grey.100',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography id="model-detail-title" variant="h5" fontWeight={800} lineHeight={1.2}>
              {model.model}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Chip
                label={friendlyProvider}
                size="small"
                sx={{ bgcolor: '#F3F4F6', fontWeight: 600, fontSize: '0.75rem' }}
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: '0.9rem', color: '#FCD34D' }} />
                <Typography variant="caption" fontWeight={700}>{model.rating}</Typography>
                <Typography variant="caption" color="text.secondary">({model.reviewCount.toLocaleString()})</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close model detail"
          sx={{ color: 'text.secondary', mt: 0.5 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 4, borderBottom: '1px solid #E5E7EB' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="Model detail tabs"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 90 },
            '& .Mui-selected': { color: 'primary.main' },
            '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
          }}
        >
          <Tab label="Details" id="model-tab-btn-0" aria-controls="model-tab-0" />
          <Tab label="How to Use" id="model-tab-btn-1" aria-controls="model-tab-1" />
          <Tab label="Pricing" id="model-tab-btn-2" aria-controls="model-tab-2" />
          <Tab label="Reviews" id="model-tab-btn-3" aria-controls="model-tab-3" />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: 4, py: 3 }}>

        {/* ── TAB 0: Details ── */}
        <TabPanel value={tab} index={0}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
            {model.description}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
            {model.tags && model.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                size="small"
                sx={{ bgcolor: 'rgba(0,100,255,0.05)', color: '#1A73E8', fontWeight: 500, borderRadius: 4 }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              mb: 4,
            }}
          >
            {[
              { label: 'Context Window', value: contextStr },
              { label: 'Speed', value: speedStr },
              { label: 'Price', value: priceStr },
            ].map((spec) => (
              <Paper
                key={spec.label}
                variant="outlined"
                sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}
              >
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  {spec.label}
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {spec.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Benchmarks
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {model.benchmarks && [
              { name: 'MMLU (Knowledge)', score: model.benchmarks.mmlu },
              { name: 'HumanEval (Coding)', score: model.benchmarks.humanEval },
              { name: 'MATH (Reasoning)', score: model.benchmarks.math },
            ].map((bench) => (
              <Box key={bench.name}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">{bench.name}</Typography>
                  <Typography variant="body2" fontWeight={700}>{bench.score}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={bench.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.100',
                    '& .MuiLinearProgress-bar': { bgcolor: '#C2612E', borderRadius: 4 }, // Updated to match screenshot orange/terracotta!
                  }}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 1: How to Use ── */}
        <TabPanel value={tab} index={1}>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Get up and running with {model.model} in {model.howToUse?.length || 0} steps.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {model.howToUse && model.howToUse.map((step, idx) => (
              <Box key={idx} display="flex" gap={3}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                    mt: 0.25,
                  }}
                >
                  {idx + 1}
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>Step {idx + 1}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{step}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 2: Pricing ── */}
        <TabPanel value={tab} index={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: `repeat(${Math.min(pricingTiers.length, 3)}, 1fr)` }, gap: 3 }}>
            {pricingTiers.map((tier) => (
              <Paper
                key={tier.name}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `2px solid ${tier.highlighted ? tier.borderColor : '#E5E7EB'}`,
                  bgcolor: tier.highlighted ? tier.bgColor : 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'relative',
                }}
              >
                {tier.highlighted && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: tier.color,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} color="text.secondary" gutterBottom>
                    {tier.name}
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={0.5} flexWrap="wrap">
                    <Typography variant="h4" fontWeight={800} sx={{ color: tier.color }}>
                      {tier.price}
                    </Typography>
                    {tier.period && (
                      <Typography variant="caption" color="text.secondary">{tier.period}</Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {tier.features.map((f, i) => (
                    <Box key={i} display="flex" alignItems="flex-start" gap={1}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: tier.color, mt: 0.3 }} />
                      <Typography variant="body2">{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={tier.highlighted ? 'contained' : 'outlined'}
                  disableElevation
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    ...(tier.highlighted
                      ? { bgcolor: tier.color, '&:hover': { bgcolor: tier.color, filter: 'brightness(0.92)' } }
                      : { borderColor: tier.color, color: tier.color }),
                  }}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </Paper>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 3: Reviews ── */}
        <TabPanel value={tab} index={3}>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Box textAlign="center">
              <Typography variant="h2" fontWeight={800} color="primary.main" lineHeight={1}>
                {model.rating}
              </Typography>
              <Stack direction="row" sx={{ color: '#FCD34D', justifyContent: 'center', mt: 0.5 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: '1rem' }} />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                {model.reviewCount.toLocaleString()} reviews
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Box sx={{ flexGrow: 1 }}>
              {model.reviewBreakdown && Object.entries(model.reviewBreakdown).reverse().map(([stars, pct]) => (
                 <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                   <Typography variant="caption" sx={{ width: 30 }}>{stars}★</Typography>
                   <LinearProgress variant="determinate" value={parseFloat(pct)} sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: '#FCD34D', borderRadius: 3 } }} />
                   <Typography variant="caption" sx={{ width: 30, color: 'text.secondary', textAlign: 'right' }}>{pct}</Typography>
                 </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {model.reviews && model.reviews.map((review, idx) => (
              <Paper key={idx} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700, fontSize: '0.85rem' }}>
                      {review.author[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{review.author}</Typography>
                      <Typography variant="caption" color="text.secondary">{review.role}</Typography>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Stack direction="row" sx={{ color: '#FCD34D', justifyContent: 'flex-end' }}>
                      {[...Array(review.stars)].map((_, i) => (
                        <StarIcon key={i} sx={{ fontSize: '0.85rem' }} />
                      ))}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {review.text}
                </Typography>
              </Paper>
            ))}
          </Box>
        </TabPanel>

      </DialogContent>
    </Dialog>
  );
}
