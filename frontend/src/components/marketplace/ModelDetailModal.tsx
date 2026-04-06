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
  useTheme,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import TranslateIcon from '@mui/icons-material/Translate';
import PaymentsIcon from '@mui/icons-material/Payments';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
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
    <Box 
      role="tabpanel" 
      hidden={value !== index} 
      id={`model-tab-${index}`} 
      aria-labelledby={`model-tab-btn-${index}`}
      sx={{ minHeight: 300 }}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </Box>
  );
}

const providerIcons: Record<string, string> = {
  openai: '🧠',
  anthropic: '🎵',
  google: '💎',
  meta: '🦙',
  mistral: '🌬️',
  cohere: '📡',
};

export default function ModelDetailModal({ model, open, onClose }: ModelDetailModalProps) {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  if (!model) return null;

  const icon = providerIcons[model.provider.toLowerCase()] || '🤖';
  const friendlyProvider = model.provider.charAt(0).toUpperCase() + model.provider.slice(1);
  const contextStr = model.inputOutput?.contextTokens ? `${(model.inputOutput.contextTokens / 1000)}K` : 'N/A';
  const priceStr = model.pricing?.payPerUse?.inputPer1M || 'Custom';
  const speedStr = model.inputOutput?.avgLatencySeconds ? `${model.inputOutput.avgLatencySeconds}s` : '1.2s';

  const pricingTiers = [];
  if (model.pricing) {
    if (model.pricing.freeTier) {
      pricingTiers.push({
        name: 'Free Tier',
        price: '$0',
        period: '',
        color: '#6366F1',
        bgColor: alpha('#6366F1', 0.04),
        borderColor: alpha('#6366F1', 0.1),
        features: [model.pricing.freeTier, 'Community support', 'Standard API access'],
      });
    }
    if (model.pricing.payPerUse) {
      pricingTiers.push({
        name: 'Pay-per-use',
        price: model.pricing.payPerUse.inputPer1M,
        period: '/ 1M in',
        color: '#BF6132',
        bgColor: alpha('#BF6132', 0.04),
        borderColor: alpha('#BF6132', 0.15),
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
        color: '#10B981',
        bgColor: alpha('#10B981', 0.04),
        borderColor: alpha('#10B981', 0.1),
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
        color: '#1F2937',
        bgColor: alpha('#1F2937', 0.04),
        borderColor: alpha('#1F2937', 0.1),
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
        sx: { 
          borderRadius: '24px', 
          maxHeight: '85vh',
          boxShadow: '0 24px 70px -18px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        },
      }}
    >
      {/* ── HEADER ── */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          pt: 4,
          pb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <Box display="flex" alignItems="center" gap={2.5}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
              boxShadow: '0 8px 20px -6px rgba(0,0,0,0.08)',
              border: '1px solid #F3F4F6',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography id="model-detail-title" variant="h5" fontWeight={800} letterSpacing="-0.5px">
              {model.model}
            </Typography>
            <Box display="flex" alignItems="center" gap={1.5} mt={0.5}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                {friendlyProvider}
              </Typography>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: '1rem', color: '#FBBF24' }} />
                <Typography variant="body2" fontWeight={700}>{model.rating}</Typography>
                <Typography variant="caption" color="text.disabled" fontWeight={500}>({model.reviewCount.toLocaleString()})</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ 
            bgcolor: '#F3F4F6', 
            '&:hover': { bgcolor: '#E5E7EB' },
            transition: 'all 0.2s'
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── TABS NAVIGATION ── */}
      <Box sx={{ px: { xs: 2, md: 4 }, borderBottom: '1px solid #F3F4F6', bgcolor: '#F9FAFB' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', bgcolor: '#BF6132' },
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 700, 
              fontSize: '0.875rem',
              minWidth: 100,
              color: 'text.secondary',
              py: 2
            },
            '& .Mui-selected': { color: '#BF6132 !important' },
          }}
        >
          <Tab icon={<BoltIcon sx={{ fontSize: '1.2rem' }} />} iconPosition="start" label="Overview" />
          <Tab icon={<TipsAndUpdatesIcon sx={{ fontSize: '1.2rem' }} />} iconPosition="start" label="Guide" />
          <Tab icon={<SmartToyIcon sx={{ fontSize: '1.2rem' }} />} iconPosition="start" label="Agent Space" />
          <Tab icon={<PaymentsIcon sx={{ fontSize: '1.2rem' }} />} iconPosition="start" label="Pricing" />
          <Tab icon={<StarIcon sx={{ fontSize: '1.2rem' }} />} iconPosition="start" label="Community" />
        </Tabs>
      </Box>

      <DialogContent sx={{ px: { xs: 3, md: 4 }, py: 0 }}>
        
        {/* ── TAB 0: Overview ── */}
        <TabPanel value={tab} index={0}>
          <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.7, mb: 3, opacity: 0.8 }}>
            {model.description}
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1} mb={4}>
            {model.tags?.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ 
                  bgcolor: alpha('#BF6132', 0.05), 
                  color: '#BF6132', 
                  fontWeight: 700, 
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: alpha('#BF6132', 0.1)
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 5,
            }}
          >
            {[
              { label: 'Context Window', value: contextStr, icon: '📄' },
              { label: 'Avg. Latency', value: speedStr, icon: '⚡' },
              { label: 'Primary Price', value: priceStr, icon: '🏷️' },
            ].map((spec) => (
              <Paper
                key={spec.label}
                variant="outlined"
                sx={{ 
                  p: 2.5, 
                  borderRadius: '16px', 
                  textAlign: 'left',
                  border: '1px solid #F3F4F6',
                  bgcolor: '#F9FAFB',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box sx={{ fontSize: '1.5rem' }}>{spec.icon}</Box>
                <Box>
                  <Typography variant="caption" color="text.disabled" fontWeight={700} display="block" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {spec.label}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                    {spec.value}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>

          <Typography variant="subtitle1" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BoltIcon sx={{ color: '#BF6132' }} /> Performance Benchmarks
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {[
              { name: 'Knowledge (MMLU)', score: model.benchmarks?.mmlu || 85 },
              { name: 'Coding (HumanEval)', score: model.benchmarks?.humanEval || 82 },
              { name: 'Reasoning (MATH)', score: model.benchmarks?.math || 78 },
            ].map((bench) => (
              <Box key={bench.name}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={700} color="text.secondary">{bench.name}</Typography>
                  <Typography variant="body2" fontWeight={800} color="#BF6132">{bench.score}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={bench.score}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#F3F4F6',
                    '& .MuiLinearProgress-bar': { 
                      borderRadius: 5,
                      background: 'linear-gradient(to right, #BF6132, #E67E22)'
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 1: Guide ── */}
        <TabPanel value={tab} index={1}>
          <Box sx={{ mb: 4, p: 3, bgcolor: alpha('#BF6132', 0.03), borderRadius: '20px', border: '1px dashed', borderColor: alpha('#BF6132', 0.2) }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <TipsAndUpdatesIcon sx={{ color: '#BF6132' }} />
              <Typography variant="subtitle1" fontWeight={800}>Quick Setup Guide</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Get integrated with {model.model} in {model.howToUse?.length || 0} essential steps.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {model.howToUse?.map((step, idx) => (
              <Paper 
                key={idx} 
                elevation={0}
                sx={{ 
                  p: 2.5, 
                  borderRadius: '16px', 
                  bgcolor: 'white', 
                  border: '1px solid #F3F4F6',
                  display: 'flex', 
                  gap: 2.5,
                  transition: 'all 0.2s',
                  '&:hover': { border: '1px solid #BF6132', transform: 'translateX(4px)' }
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    bgcolor: '#BF6132',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </Box>
                <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.6, mt: 0.5 }}>
                  {step}
                </Typography>
              </Paper>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 2: Agent Builder ── */}
        <TabPanel value={tab} index={2}>
          {model.agents?.supported ? (
            <Box>
              <Typography variant="body1" color="text.secondary" mb={4} sx={{ opacity: 0.8 }}>
                Optimized for agentic workflows. Built-in support for tool use, function calling, and multi-step reasoning.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {model.agents.creationSteps.map((step, idx) => (
                  <Paper 
                    key={idx} 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: '16px', 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2,
                      border: '1px solid #F3F4F6',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#F9FAFB' }
                    }}
                  >
                    <CheckCircleOutlineIcon sx={{ color: '#10B981', mt: 0.2, fontSize: '1.2rem' }} />
                    <Typography variant="body2" fontWeight={700} color="text.primary">{step}</Typography>
                  </Paper>
                ))}
              </Box>
              <Button 
                fullWidth 
                variant="contained" 
                disableElevation 
                sx={{ 
                  mt: 5, 
                  borderRadius: '14px', 
                  py: 1.75, 
                  fontWeight: 800, 
                  bgcolor: '#BF6132',
                  '&:hover': { bgcolor: '#A65128' },
                  textTransform: 'none'
                }}
              >
                Start Building with {model.model} Agent →
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <SmartToyIcon sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" fontWeight={700} color="text.secondary">Agent Flow Restricted</Typography>
              <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 300, mx: 'auto', mt: 1 }}>
                This model is currently tuned for completion and zero-shot tasks rather than persistent agent loops.
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* ── TAB 3: Pricing ── */}
        <TabPanel value={tab} index={3}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: `repeat(${Math.max(pricingTiers.length, 1)}, 1fr)` }, 
            gap: 2.5,
            mb: 4
          }}>
            {pricingTiers.map((tier) => (
              <Box
                key={tier.name}
                sx={{
                  p: 3,
                  borderRadius: '24px',
                  bgcolor: tier.bgColor,
                  border: '1px solid',
                  borderColor: tier.borderColor,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px -10px rgba(0,0,0,0.05)' }
                }}
              >
                {tier.highlighted && (
                  <Chip
                    label="PRO CHOICE"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 24,
                      bgcolor: tier.color,
                      color: 'white',
                      fontWeight: 900,
                      fontSize: '0.65rem',
                      px: 1,
                      letterSpacing: '0.05em'
                    }}
                  />
                )}
                <Box>
                  <Typography variant="caption" fontWeight={900} color={tier.color} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {tier.name}
                  </Typography>
                  <Box display="flex" alignItems="baseline" gap={0.5} mt={1}>
                    <Typography variant="h4" fontWeight={900} color="text.primary">
                      {tier.price}
                    </Typography>
                    {tier.period && (
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>{tier.period}</Typography>
                    )}
                  </Box>
                </Box>
                <Divider sx={{ opacity: 0.1, my: 1 }} />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {tier.features.map((f, i) => (
                    <Box key={i} display="flex" alignItems="flex-start" gap={1.25}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '1rem', color: tier.color, mt: 0.3 }} />
                      <Typography variant="body2" fontWeight={500} color="text.secondary">{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  disableElevation
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: '12px',
                    py: 1.25,
                    fontWeight: 800,
                    bgcolor: tier.color,
                    '&:hover': { bgcolor: tier.color, filter: 'brightness(0.9)' },
                    textTransform: 'none'
                  }}
                >
                  {tier.name === 'Enterprise' ? 'Custom Quote' : 'Activate Plan'}
                </Button>
              </Box>
            ))}
          </Box>
        </TabPanel>

        {/* ── TAB 4: Reviews ── */}
        <TabPanel value={tab} index={4}>
          <Paper variant="outlined" sx={{ p: 4, borderRadius: '24px', border: '1px solid #F3F4F6', mb: 4, bgcolor: '#F9FAFB' }}>
            <Box display="flex" alignItems="center" gap={{ xs: 4, md: 8 }} flexWrap="wrap">
              <Box textAlign="center">
                <Typography variant="h2" fontWeight={900} color="text.primary" sx={{ mb: -1 }}>
                  {model.rating}
                </Typography>
                <Stack direction="row" sx={{ color: '#FBBF24', justifyContent: 'center', mt: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} sx={{ fontSize: '1.25rem' }} />
                  ))}
                </Stack>
                <Typography variant="caption" color="text.disabled" fontWeight={700} display="block" mt={1}>
                  BASED ON {model.reviewCount.toLocaleString()} RATINGS
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                {model.reviewBreakdown && Object.entries(model.reviewBreakdown).reverse().map(([stars, pct]) => (
                  <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={800} sx={{ width: 30, color: 'text.secondary' }}>{stars} ★</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(pct)} 
                      sx={{ 
                        flexGrow: 1, 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: '#E5E7EB', 
                        '& .MuiLinearProgress-bar': { bgcolor: '#FBBF24', borderRadius: 3 } 
                      }} 
                    />
                    <Typography variant="caption" fontWeight={700} sx={{ width: 40, color: 'text.disabled', textAlign: 'right' }}>{pct}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {model.reviews && model.reviews.length > 0 ? (
              model.reviews.map((review, idx) => (
                <Paper 
                  key={idx} 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '20px', 
                    border: '1px solid #F3F4F6',
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#BF6132', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        sx={{ 
                          width: 44, 
                          height: 44, 
                          bgcolor: alpha('#BF6132', 0.1), 
                          color: '#BF6132', 
                          fontWeight: 800, 
                          fontSize: '1rem',
                          border: '2px solid white',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}
                      >
                        {review.author[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">{review.author}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>{review.role}</Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Stack direction="row" sx={{ color: '#FBBF24', justifyContent: 'flex-end', mb: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} sx={{ fontSize: '0.9rem', color: i < review.stars ? '#FBBF24' : '#E5E7EB' }} />
                        ))}
                      </Stack>
                      <Typography variant="caption" color="text.disabled" fontWeight={700}>{review.date}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                    {review.text}
                  </Typography>
                </Paper>
              ))
            ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                   <Typography variant="body2" color="text.disabled" fontWeight={600}>
                      No community feedback yet. Be the first to analyze!
                   </Typography>
                </Box>
            )}
          </Box>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
