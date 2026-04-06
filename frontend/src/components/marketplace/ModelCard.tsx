'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FoundationModel } from '../../app/marketplace/page';

interface MCardProps {
  model: FoundationModel;
  onLearnMore?: (model: FoundationModel) => void;
}

const tagColors = [
  { bg: 'rgba(59,130,246,0.08)', color: '#1D4ED8' },
  { bg: 'rgba(20,184,166,0.08)', color: '#0F766E' },
  { bg: 'rgba(245,158,11,0.08)', color: '#B45309' },
  { bg: 'rgba(244,63,94,0.08)', color: '#BE123C' },
  { bg: 'rgba(139,92,246,0.08)', color: '#6D28D9' },
];

const providerIcons: Record<string, string> = {
  openai: '🌟',
  anthropic: '🎵',
  google: '🧠',
  meta: '🦙',
  mistral: '🌬️',
  cohere: '📡',
};

export default function ModelCard({ model, onLearnMore }: MCardProps) {
  const icon = providerIcons[model.provider.toLowerCase()] || '🤖';
  const priceLabel = model.pricing?.payPerUse?.inputPer1M ? `${model.pricing.payPerUse.inputPer1M}/1M tk` : 'Custom';
  const friendlyProvider = model.provider.charAt(0).toUpperCase() + model.provider.slice(1);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        bgcolor: 'white',
        transition: 'all 0.18s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#C2612E',
          boxShadow: '0 8px 28px -4px rgba(194,97,46,0.12)',
          transform: 'translateY(-3px)',
        },
      }}
      onClick={() => onLearnMore?.(model)}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        <Box display="flex" justifyItems="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5} sx={{ flexGrow: 1 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: '#F3F4F6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              {icon}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} color="text.primary">
                {model.model}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {friendlyProvider}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.55, flexGrow: 1 }}>
          {model.description}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={0.75} mb={2.5}>
          {model.tags && model.tags.slice(0, 4).map((tag, i) => {
            const c = tagColors[i % tagColors.length];
            return (
              <Chip
                key={tag}
                label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                size="small"
                sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.68rem', height: 22, borderRadius: '6px' }}
              />
            );
          })}
        </Box>

        <Box sx={{ borderTop: '1px solid #F3F4F6', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Stack direction="row">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ fontSize: '0.8rem', color: i < Math.round(model.rating) ? '#FBBF24' : '#E5E7EB' }} />
              ))}
            </Stack>
            <Typography variant="caption" fontWeight={700} color="text.primary" ml={0.3}>
              {model.rating}
            </Typography>
            <Typography variant="caption" color="text.disabled" ml={0.2}>
              ({model.reviewCount.toLocaleString()})
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="caption" fontWeight={700} sx={{ color: '#059669' }}>
              {priceLabel}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: '#C2612E', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={(e) => { e.stopPropagation(); onLearnMore?.(model); }}
            >
              Learn more →
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
