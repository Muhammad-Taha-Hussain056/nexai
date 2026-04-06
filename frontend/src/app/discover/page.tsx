'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Divider, IconButton } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useSearchParams } from 'next/navigation';
import discoverData from '../../data/discover_feed.json';
import { fetchResearchFeed, ResearchItem, fetchModelReferences, FoundationModel } from '@/services/modelService';
import ModelDetailModal from '../../components/marketplace/ModelDetailModal';

const filterTabs = [
  { label: 'All', active: true },
  { label: 'Reasoning', color: '#6366F1' },
  { label: 'Multimodal', color: '#10B981' },
  { label: 'Alignment', color: '#EC4899' },
  { label: 'Efficiency', color: '#F59E0B', icon: '⚡' },
  { label: 'Open Weights', color: '#3B82F6' },
];

export default function Discover() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const [feedData, setFeedData] = useState({
    items: discoverData.items as unknown as ResearchItem[],
    feedTitle: discoverData.feedTitle
  });
  const items = feedData.items;
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedModelForModal, setSelectedModelForModal] = useState<FoundationModel | null>(null);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await fetchResearchFeed();
        if (data && data.items) {
          setFeedData({
            items: data.items,
            feedTitle: data.feedTitle
          });
          
          const sharedId = searchParams.get('id');
          if (sharedId && data.items.some(i => i.id === sharedId)) {
            setActiveId(sharedId);
          } else if (data.items.length > 0) {
            setActiveId(data.items[0].id);
          }
        }
      } catch (err) {
        console.error("Backend feed fetch failed, using fallback.", err);
        const sharedId = searchParams.get('id');
        if (sharedId && items.some(i => i.id === sharedId)) {
          setActiveId(sharedId);
        } else if (items.length > 0) {
          setActiveId(items[0].id);
        }
      }
    }
    void loadFeed();
  }, [searchParams]);

  const activeItem = items.find(p => p.id === activeId) || items[0];

  const handleReferenceClick = async (modelId: string) => {
    if (!activeItem) return;
    try {
      const data = await fetchModelReferences(activeItem.id);
      const targetModel = data.modelReferences.find(m => m.id === modelId);
      
      if (targetModel) {
        // Map backend quirks (overview -> description, agentCreation -> agents)
        const normalized: FoundationModel = {
          ...targetModel,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          description: (targetModel as any).overview || targetModel.description || '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          agents: (targetModel as any).agentCreation || targetModel.agents || { supported: false, creationSteps: [] },
          rating: targetModel.rating || 4.8,
          reviewCount: targetModel.reviewCount || 1000,
          reviewBreakdown: targetModel.reviewBreakdown || { "5": "80%", "4": "15%", "3": "3%", "2": "1%", "1": "1%" },
        };
        setSelectedModelForModal(normalized);
        setDetailModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to load model details from references.", err);
    }
  };

  const getTagStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'reasoning': return { bg: '#EEF2FF', color: '#6366F1', line: '#4F46E5' };
      case 'multimodal': return { bg: '#ECFDF5', color: '#10B981', line: '#059669' };
      case 'alignment': return { bg: '#FDF2F8', color: '#EC4899', line: '#DB2777' };
      case 'open weights': return { bg: '#EFF6FF', color: '#3B82F6', line: '#2563EB' };
      case 'efficiency': return { bg: '#FFFBEB', color: '#F59E0B', line: '#D97706' };
      default: return { bg: '#F3F4F6', color: '#4B5563', line: '#111827' };
    }
  };

  const filteredItems = items.filter(p => activeFilter === 'All' || p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
      <Navbar />

      <Box sx={{ px: { xs: 3, md: 5 }, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
            <Typography variant="h5" fontWeight={900} letterSpacing="-0.5px">{feedData.feedTitle || 'AI Research Feed'}</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ pb: 0.5 }}>Curated breakthroughs · Updated daily</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ bgcolor: '#D1FAE5', color: '#047857', borderRadius: '40px', px: 2, py: 0.5, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#047857' }} />
              {items.length} breakthroughs
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
        
        <Box sx={{ width: { xs: 320, md: 380 }, borderRight: '1px solid #E5E7EB', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredItems.map((item) => {
            const tagStyles = getTagStyles(item.category);
            const isSelected = activeId === item.id;
            const pd = new Date(item.date);
            const formattedMonth = pd.toLocaleString('default', { month: 'short' }).toUpperCase();
            const formattedDay = pd.getDate().toString();
            
            return (
              <Box 
                key={item.id} 
                onClick={() => setActiveId(item.id)}
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
                <Box sx={{ width: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3, flexShrink: 0 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, lineHeight: 1 }}>{formattedMonth}</Typography>
                  <Typography variant="h5" fontWeight={900} color="text.primary" sx={{ mt: 0.5, lineHeight: 1 }}>{formattedDay}</Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, pt: 3, pr: 3, pb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ color: '#4B5563' }}>{item.organization}</Typography>
                    <Box sx={{ bgcolor: tagStyles.bg, color: tagStyles.color, fontSize: '0.6rem', fontWeight: 800, px: 1, py: 0.25, borderRadius: 1.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      {item.category}
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={800} lineHeight={1.3} mb={1} color="text.primary">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.5, fontSize: '0.8rem' }}>
                    {item.summary}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {filteredItems.length === 0 && (
            <Box p={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">No breakthroughs found for {activeFilter}</Typography>
            </Box>
          )}
        </Box>

        {activeItem ? (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            <Box sx={{ p: { xs: 4, md: 8, lg: 10 }, maxWidth: 1000, mx: 'auto', width: '100%' }}>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {activeItem.organization} • {new Date(activeItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
                <Box sx={{ bgcolor: getTagStyles(activeItem.category).bg, color: getTagStyles(activeItem.category).color, fontSize: '0.65rem', fontWeight: 800, px: 1, py: 0.25, borderRadius: 1.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  {activeItem.category}
                </Box>
              </Box>

              <Typography variant="h3" fontWeight={900} letterSpacing="-1px" lineHeight={1.2} mb={activeItem.citation ? 1 : 5}>
                {activeItem.title}
              </Typography>
              
              {activeItem.citation && (
                <Typography variant="caption" color="text.secondary" mb={5} sx={{ display: 'block' }}>
                  {activeItem.citation}
                </Typography>
              )}

              <Divider sx={{ mb: 4, borderColor: '#F3F4F6' }} />

              <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                EXECUTIVE OVERVIEW
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                {activeItem.overview || activeItem.summary}
              </Typography>

              {activeItem.metrics && Object.keys(activeItem.metrics).length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(Object.keys(activeItem.metrics).length, 3)}, 1fr)` }, gap: 3, mb: 6 }}>
                  {Object.entries(activeItem.metrics).map(([key, val]) => (
                    <Box key={key} sx={{ bgcolor: '#F9FAFB', borderRadius: 3, p: 3, textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={900} mb={1}>{val as React.ReactNode}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{key.replace(/([A-Z])/g, ' $1').trim()}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {activeItem.keyFindings && activeItem.keyFindings.length > 0 && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    KEY BREAKTHROUGHS
                  </Typography>
                  <Stack spacing={2} mb={6}>
                    {activeItem.keyFindings.map((finding: string, idx: number) => (
                      <Box key={idx} sx={{ bgcolor: '#F9FAFB', borderRadius: 2, py: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ color: '#D46F35', fontWeight: 900 }}>{idx + 1}.</Typography>
                        <Typography variant="body2" color="#4B5563" fontWeight={500} lineHeight={1.6}>{finding}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}

              {activeItem.modelReferences && activeItem.modelReferences.length > 0 && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    MODELS REFERENCED
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 6, flexWrap: 'wrap' }}>
                    {activeItem.modelReferences.map((m: string) => (
                      <Box 
                        key={m} 
                        onClick={() => handleReferenceClick(m)}
                        sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', px: 2, py: 0.75, display: 'flex', alignItems: 'center', gap: 1.2, bgcolor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#F9FAFB', borderColor: '#BF6132' } }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: m.toLowerCase().includes('gemini') ? '#3B82F6' : m.toLowerCase().includes('gpt') ? '#10B981' : m.toLowerCase().includes('llama') ? '#111827' : m.toLowerCase().includes('claude') ? '#D97706' : '#F59E0B' }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">{m}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {activeItem.impactAssessment && (
                <>
                  <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ letterSpacing: 1.5, mb: 2, display: 'block' }}>
                    STRATEGIC IMPACT
                  </Typography>
                  <Box sx={{ bgcolor: '#FFF4ED', borderRadius: 3, p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                    <Typography sx={{ color: '#D46F35', fontSize: '1.2rem' }}>⚡</Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ color: '#C2511D' }}>
                      {activeItem.impactAssessment}
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
                   sx={{ width: '100%', maxWidth: 400, borderRadius: '12px', bgcolor: '#D46F35', py: 1.5, fontWeight: 800, textTransform: 'none', '&:hover': { bgcolor: '#B3511D' } }}
                 >
                   Open Collaborative Analysis
                 </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<BookmarkBorderOutlinedIcon />}
                  sx={{ borderRadius: '12px', borderColor: '#E5E7EB', color: 'text.primary', py: 1, px: 3, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#F9FAFB' } }}
                >
                  Save
                </Button>
                <IconButton sx={{ bgcolor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                   <ShareOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
             <Typography color="text.secondary">Select an article to begin collaborative analysis.</Typography>
          </Box>
        )}
      </Box>

      {/* Detail Modal */}
      <ModelDetailModal
        model={selectedModelForModal}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

    </Box>
  );
}
