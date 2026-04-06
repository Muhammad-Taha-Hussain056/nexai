'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Stack, Divider, IconButton } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import discoverData from '../../data/discover_feed.json';

const filterTabs = [
  { label: 'All', active: true },
  { label: 'Reasoning', color: '#F472B6' },
  { label: 'Multimodal', color: '#60A5FA' },
  { label: 'Alignment', color: '#3B82F6' },
  { label: 'Efficiency', color: '#FCD34D', icon: '⚡' },
  { label: 'Open Weights', color: '#FCD34D' },
];

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState('All');
  const papers = discoverData.items;
  const [activeId, setActiveId] = useState(papers[0]?.id);

  const activePaper = papers.find(p => p.id === activeId) || papers[0];

  const getTagStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'reasoning': return { bg: '#EFF6FF', color: '#3B82F6', line: '#111827' };
      case 'multimodal': return { bg: '#ECFDF5', color: '#10B981', line: '#10B981' };
      case 'alignment': return { bg: '#FFF4ED', color: '#D46F35', line: '#D46F35' };
      case 'open weights': return { bg: '#EFF6FF', color: '#3B82F6', line: '#3B82F6' };
      case 'efficiency': return { bg: '#FFFBEB', color: '#D97706', line: '#D97706' };
      default: return { bg: '#F3F4F6', color: '#4B5563', line: '#111827' };
    }
  };

  const filteredPapers = papers.filter(p => activeFilter === 'All' || p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
      <Navbar />

      {/* ── Subheader ── */}
      <Box sx={{ px: { xs: 3, md: 5 }, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px">{discoverData.feedTitle || 'AI Research Feed'}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ pb: 0.5 }}>Curated breakthroughs · Updated daily</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#D1FAE5', color: '#047857', borderRadius: '40px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#047857' }} />
              {papers.length} papers this week
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<NotificationsNoneOutlinedIcon fontSize="small" sx={{ color: '#FCD34D' }} />}
              sx={{ borderRadius: '40px', textTransform: 'none', fontWeight: 600, color: 'text.primary', borderColor: '#E5E7EB', py: 0.5, px: 2, '&:hover': { bgcolor: '#F9FAFB' } }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <Button
                key={tab.label}
                variant={isActive ? 'contained' : 'outlined'}
                disableElevation
                onClick={() => setActiveFilter(tab.label)}
                sx={{
                  borderRadius: '40px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.5,
                  px: 2.5,
                  color: isActive ? 'white' : 'text.primary',
                  bgcolor: isActive ? '#111827' : 'transparent',
                  borderColor: isActive ? '#111827' : '#E5E7EB',
                  whiteSpace: 'nowrap',
                  '&:hover': { bgcolor: isActive ? '#2b2b2b' : '#F9FAFB' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {tab.icon && <Typography sx={{ color: tab.color, fontSize: '0.8rem', lineHeight: 1 }}>{tab.icon}</Typography>}
                {!tab.icon && !isActive && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: tab.color }} />}
                {tab.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* left column */}
        <Box sx={{ width: { xs: 320, md: 380 }, borderRight: '1px solid #E5E7EB', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredPapers.map((paper) => {
            const tagStyles = getTagStyles(paper.category);
            const isSelected = activeId === paper.id;
            const pd = new Date(paper.date);
            const formattedMonth = pd.toLocaleString('default', { month: 'short' }).toUpperCase();
            const formattedDay = pd.getDate().toString();
            
            return (
              <Box 
                key={paper.id} 
                onClick={() => setActiveId(paper.id)}
                sx={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #E5E7EB',
                  borderLeft: isSelected ? `4px solid ${tagStyles.line}` : '4px solid transparent',
                  bgcolor: isSelected ? '#F9FAFB' : 'white',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: '#F9FAFB' }
                }}
              >
                {/* Date Column */}
                <Box sx={{ width: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, flexShrink: 0 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, lineHeight: 1 }}>{formattedMonth}</Typography>
                  <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ mt: 0.5, lineHeight: 1 }}>{formattedDay}</Typography>
                </Box>
                
                {/* Content Column */}
                <Box sx={{ flexGrow: 1, pt: 3, pr: 3, pb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#4B5563' }}>{paper.organization}</Typography>
                    <Box sx={{ bgcolor: tagStyles.bg, color: tagStyles.color, fontSize: '0.6rem', fontWeight: 800, px: 1, py: 0.25, borderRadius: 1.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      {paper.category}
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} lineHeight={1.3} mb={1} color="text.primary">
                    {paper.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, fontSize: '0.8rem' }}>
                    {paper.summary}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {filteredPapers.length === 0 && (
            <Box p={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">No papers found for {activeFilter}</Typography>
            </Box>
          )}
        </Box>

        {/* Right Detail Pane */}
        {activePaper ? (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            <Box sx={{ p: { xs: 4, md: 8, lg: 10 }, maxWidth: 1000, mx: 'auto', width: '100%' }}>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {activePaper.organization} • {new Date(activePaper.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                <Box sx={{ bgcolor: getTagStyles(activePaper.category).bg, color: getTagStyles(activePaper.category).color, fontSize: '0.65rem', fontWeight: 800, px: 1, py: 0.25, borderRadius: 1.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {activePaper.category}
                </Box>
              </Box>

              <Typography variant="h3" fontWeight={900} letterSpacing="-1px" lineHeight={1.2} mb={activePaper.citation ? 1 : 5}>
                {activePaper.title}
              </Typography>
              
              {activePaper.citation && (
                <Typography variant="caption" color="text.secondary" mb={5} sx={{ display: 'block' }}>
                  {activePaper.citation}
                </Typography>
              )}

              <Divider sx={{ mb: 4, borderColor: '#F3F4F6' }} />

              <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                OVERVIEW
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                {activePaper.overview || activePaper.summary}
              </Typography>

              {activePaper.metrics && Object.keys(activePaper.metrics).length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(Object.keys(activePaper.metrics).length, 3)}, 1fr)` }, gap: 3, mb: 6 }}>
                  {Object.entries(activePaper.metrics).map(([key, val]) => (
                    <Box key={key} sx={{ bgcolor: '#F9FAFB', borderRadius: 3, p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={900} mb={1}>{val as React.ReactNode}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {activePaper.keyFindings && activePaper.keyFindings.length > 0 && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    KEY FINDINGS
                  </Typography>
                  <Stack spacing={2} mb={6}>
                    {activePaper.keyFindings.map((finding: string, idx: number) => (
                      <Box key={idx} sx={{ bgcolor: '#F9FAFB', borderRadius: 2, py: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ color: '#D46F35', fontWeight: 900 }}>{idx + 1}.</Typography>
                        <Typography variant="body2" color="#4B5563" fontWeight={500} lineHeight={1.6}>{finding}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}

              {activePaper.modelReferences && activePaper.modelReferences.length > 0 && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    MODELS REFERENCED
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 6, flexWrap: 'wrap' }}>
                    {activePaper.modelReferences.map((m: string) => (
                      <Box key={m} sx={{ border: '1px solid #E5E7EB', borderRadius: '40px', px: 2, py: 0.75, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#FFFFFF' }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: m.includes('gemini') ? '#3B82F6' : m.includes('gpt') ? '#10B981' : m.includes('llama') ? '#8B5CF6' : '#F59E0B' }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">{m}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {activePaper.impactAssessment && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    IMPACT ASSESSMENT
                  </Typography>
                  <Box sx={{ bgcolor: '#FFF4ED', borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Typography sx={{ color: '#D46F35', fontSize: '1.2rem' }}>⚡</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ color: '#C2511D' }}>
                      {activePaper.impactAssessment}
                    </Typography>
                  </Box>
                </>
              )}

            </Box>
            
            <Box sx={{ mt: 'auto', p: 3, borderTop: '1px solid #E5E7EB', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                 <Button
                   variant="contained"
                   disableElevation
                   startIcon={<ChatBubbleIcon />}
                   sx={{ width: '100%', maxWidth: 400, borderRadius: '40px', bgcolor: '#D46F35', py: 1.5, fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#B3511D' } }}
                 >
                   Discuss in Chat Hub
                 </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkBorderOutlinedIcon />}
                  sx={{ borderRadius: '40px', borderColor: '#E5E7EB', color: 'text.primary', py: 1, px: 3, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#F9FAFB' } }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ShareOutlinedIcon />}
                  sx={{ borderRadius: '40px', borderColor: '#E5E7EB', color: 'text.primary', py: 1, px: 3, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#F9FAFB' } }}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
             <Typography color="text.secondary">Select an article to view details.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
