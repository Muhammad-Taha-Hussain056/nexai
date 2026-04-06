'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  TextField,
  Divider,
  Checkbox,
  IconButton,
  Chip,
} from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MicNoneIcon from '@mui/icons-material/MicNone';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import WindowIcon from '@mui/icons-material/Window';

// ─── Data ────────────────────────────────────────────────────────────────────

const useCaseTabs = [
  { label: 'Build a business', icon: '🏢' },
  { label: 'Help me learn', icon: '🎓' },
  { label: 'Monitor the situation', icon: '📡' },
  { label: 'Research', icon: '🔍' },
  { label: 'Create content', icon: '📝' },
  { label: 'Analyze & research', icon: '📊' }
];

const templates = [
  {
    categories: ['Research', 'Analyze & research'],
    emoji: '🔍',
    title: 'Research Agent',
    desc: 'Automates web research, summarises findings, and generates structured reports.',
    tags: ['GPT-5.4', 'Web search'],
  },
  {
    categories: ['Build a business'],
    emoji: '💼',
    title: 'Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues.',
    tags: ['GPT-5.4', 'Ticketing'],
  },
  {
    categories: ['Build a business', 'Analyze & research'],
    emoji: '💻',
    title: 'Code Review Agent',
    desc: 'Reviews PRs, flags bugs, and suggests improvements.',
    tags: ['Claude Opus 4.6', 'GitHub'],
  },
  {
    categories: ['Research', 'Analyze & research'],
    emoji: '📊',
    title: 'Data Analysis Agent',
    desc: 'Processes spreadsheets and generates visual insights.',
    tags: ['Gemini', 'Sheets'],
  },
  {
    categories: ['Create content'],
    emoji: '📝',
    title: 'Content Writer Agent',
    desc: 'Creates blog posts and marketing copy with brand voice.',
    tags: ['Claude Opus 4.6', 'Marketing'],
  },
  {
    categories: ['Help me learn'],
    emoji: '🎓',
    title: 'Tutor Agent',
    desc: 'Explains complex topics and creates study plans.',
    tags: ['GPT-5.4', 'Education'],
  },
  {
    categories: ['Monitor the situation'],
    emoji: '📡',
    title: 'Brand Monitor',
    desc: 'Tracks social mentions and news alerts in real-time.',
    tags: ['Claude 3.5', 'Social'],
  }
];

const suggestions = [
  { category: 'Build a business', icon: '🚀', text: 'Build a space exploration timeline app', color: '#FCE7F3' },
  { category: 'Build a business', icon: '📊', text: 'Create a real-time stock market tracker', color: '#E0E7FF' },
  { category: 'Create content', icon: '🤖', text: 'Prototype an AI chatbot demo application', color: '#F3E8FF' },
  { category: 'Monitor the situation', icon: '📋', text: 'Create a project management Kanban board', color: '#FFEDD5' },
];

const checklistItems = [
  'Dashboard Layout Adjustments',
  'Design agent system prompts',
  'Configure tool integrations',
];

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('Build a business');
  const [input, setInput] = useState('');

  const filteredTemplates = templates.filter(t => t.categories.includes(activeTab) || activeTab === 'Analyze & research');
  const filteredSuggestions = suggestions.filter(s => s.category === activeTab);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAFAFA', overflow: 'hidden', pt: '72px' }}>
      <Navbar />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 320,
            borderRight: '1px solid #EDEDED',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            flexShrink: 0,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: '#D46F35', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SmartToyIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#111827" lineHeight={1.2}>
                Agent Hub
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                Configure and deploy autonomous AI entities.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              bgcolor: '#111827',
              color: 'white',
              borderRadius: 1.5,
              py: 1.2,
              fontWeight: 700,
              textTransform: 'none',
              mb: 4,
              '&:hover': { bgcolor: '#1F2937' }
            }}
          >
            + New Agent
          </Button>

          {/* Guide Card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#FFF4ED',
              border: '1px solid #FFE8DC',
              borderRadius: 2,
              p: 2.5,
              mb: 4,
            }}
          >
            <Typography variant="body2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: '#111827' }}>
              <AutoAwesomeIcon sx={{ fontSize: '1rem', color: '#D46F35' }}/> AI Consultant
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5, lineHeight: 1.5 }}>
              Describe your workflow and we&apos;ll suggest the perfect agent blueprint.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              size="small"
              sx={{
                bgcolor: 'white',
                color: '#111827',
                border: '1px solid #E5E7EB',
                borderRadius: 1,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: '#F9FAFB' }
              }}
            >
              Start Consultation →
            </Button>
          </Paper>

          <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 1.5, mb: 2, display: 'block' }}>
            ACTIVE TASKS
          </Typography>
          <Stack spacing={1}>
            {checklistItems.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, borderRadius: 1.5, '&:hover': { bgcolor: '#F9FAFB' } }}>
                <Checkbox size="small" disableRipple sx={{ p: 0.5, color: '#D1D5DB' }} />
                <Typography variant="caption" noWrap sx={{ color: '#4B5563', fontWeight: 600, ml: 1 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', px: { xs: 2, sm: 4, lg: 6 }, pt: { xs: 6, md: 8 }, pb: 8, boxSizing: 'border-box' }}>
            
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" fontWeight={900} letterSpacing="-1.5px" sx={{ color: '#111827', mb: 1.5 }}>
                Autonomous <Box component="span" sx={{ color: '#D46F35' }}>Workflows</Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
                Your AI agents operate independently, managing complex tasks from end to end.
              </Typography>
            </Box>

            {/* Massive Input Block */}
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2.5, 
                border: '1px solid #E5E7EB', 
                p: 3, 
                mb: 4, 
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'border-color 0.2s',
                '&:focus-within': { borderColor: '#D46F35' }
              }}
            >
              <TextField 
                fullWidth 
                multiline 
                minRows={2} 
                maxRows={6} 
                variant="standard" 
                placeholder={activeTab === 'Build a business' ? "What business plan should we draft today?" : `How can we help with ${activeTab.toLowerCase()}?`}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                sx={{ mb: 2 }}
                InputProps={{ 
                  disableUnderline: true, 
                  sx: { fontSize: '1.2rem', color: '#111827', fontWeight: 600, '& textarea::placeholder': { color: '#9CA3AF', opacity: 1 } } 
                }} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #F3F4F6' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton size="small" sx={{ color: '#9333EA', bgcolor: '#F3E8FF', '&:hover': { bgcolor: '#E9D5FF' } }}><MicNoneIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#D97706', bgcolor: '#FEF3C7', '&:hover': { bgcolor: '#FDE68A' } }}><FileUploadOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#2563EB', bgcolor: '#EFF6FF', '&:hover': { bgcolor: '#DBEAFE' } }}><VideoCallOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#059669', bgcolor: '#D1FAE5', '&:hover': { bgcolor: '#A7F3D0' } }}><ImageOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#374151', bgcolor: '#F3F4F6', '&:hover': { bgcolor: '#E5E7EB' } }}><AttachFileIcon fontSize="small" /></IconButton>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>GPT-5.4 Ready</Typography>
                  <Button 
                    variant="contained" 
                    disableElevation 
                    endIcon={<SendIcon sx={{ fontSize: '0.9rem' }} />}
                    sx={{ 
                      bgcolor: '#D46F35', 
                      color: 'white', 
                      fontWeight: 800, 
                      px: 3, 
                      py: 1, 
                      borderRadius: 1.5,
                      '&:hover': { bgcolor: '#B3511D' } 
                    }}
                  >
                    Deploy
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Prompt Tabs Row (Horizontal Scrollable) */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              overflowX: 'auto', 
              mb: 5, 
              pb: 1.5,
              '&::-webkit-scrollbar': { height: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 4 },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }
            }}>
              <Button
                variant="contained"
                disableElevation
                startIcon={<WindowIcon sx={{ fontSize: '1.2rem' }} />}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: '#111827',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 3,
                  mr: 1,
                  '&:hover': { bgcolor: '#374151' },
                }}
              >
                Use cases
              </Button>
              {useCaseTabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <Button
                    key={tab.label}
                    variant={isActive ? 'contained' : 'outlined'}
                    disableElevation
                    onClick={() => setActiveTab(tab.label)}
                    sx={{
                      borderRadius: 1.5,
                      minWidth: 'max-content',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      color: isActive ? 'white' : '#4B5563',
                      borderColor: isActive ? '#D46F35' : '#EDEDED',
                      bgcolor: isActive ? '#D46F35' : 'white',
                      textTransform: 'none',
                      fontWeight: 700,
                      px: 3.5,
                      py: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      '&:hover': { bgcolor: isActive ? '#B3511D' : '#F9FAFB', borderColor: '#D46F35' }
                    }}
                  >
                    <Box component="span" sx={{ fontSize: '1rem' }}>{tab.icon}</Box>
                    {tab.label}
                  </Button>
                );
              })}
            </Box>

            {/* Templates Section */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Typography variant="overline" fontWeight={900} color="text.disabled" sx={{ letterSpacing: 2 }}>
                  {activeTab.toUpperCase()} BLUEPRINTS
                </Typography>
                <Chip label={filteredTemplates.length} size="small" sx={{ height: 20, bgcolor: '#F3F4F6', color: '#6B7280', fontWeight: 800, fontSize: '0.7rem' }} />
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {filteredTemplates.map((tpl, i) => (
                  <Paper 
                    key={i} 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      border: '1px solid #E5E7EB', 
                      borderRadius: 2, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { borderColor: '#D46F35', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', transform: 'translateY(-4px)' }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#111827' }}>
                        <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F9FAFB', borderRadius: 1 }}>{tpl.emoji}</Box>
                        {tpl.title}
                      </Typography>
                      <AutoAwesomeIcon sx={{ fontSize: '1rem', color: '#D46F35', opacity: 0.5 }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6, fontWeight: 500 }}>
                      {tpl.desc}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {tpl.tags.map(tag => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#F9FAFB', 
                            color: tag.includes('GPT') ? '#3B82F6' : tag.includes('Claude') ? '#10B981' : '#D46F35', 
                            fontWeight: 800, 
                            fontSize: '0.65rem',
                            border: '1px solid rgba(0,0,0,0.05)',
                            borderRadius: 1
                          }} 
                        />
                      ))}
                    </Stack>
                  </Paper>
                ))}
                
                {/* Build from Scratch Card */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    border: '2px dashed #FFE8DC', 
                    bgcolor: '#FFF4ED', 
                    borderRadius: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 1.5, 
                    cursor: 'pointer', 
                    minHeight: 180,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#FFE8DC', borderColor: '#D46F35' } 
                  }}
                >
                  <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(212,111,53,0.1)' }}>
                    <AddIcon sx={{ color: '#D46F35' }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#D46F35' }}>
                    Custom {activeTab} Agent
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Divider sx={{ my: 6, borderColor: '#F3F4F6' }} />

            {/* Suggestions Divider List */}
            {filteredSuggestions.length > 0 && (
              <>
                <Typography variant="overline" fontWeight={900} color="text.disabled" sx={{ letterSpacing: 2, mb: 2, display: 'block' }}>
                  QUICK STARTS FOR {activeTab.toUpperCase()}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {filteredSuggestions.map((s, idx) => (
                    <Paper 
                      key={idx} 
                      elevation={0}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        p: 2, 
                        borderRadius: 1.5, 
                        border: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'white', borderColor: '#D46F35', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
                      }}
                    >
                      <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                        {s.icon}
                      </Box>
                      <Typography variant="body2" color="#4B5563" fontWeight={600} noWrap>{s.text}</Typography>
                    </Paper>
                  ))}
                </Box>
              </>
            )}

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
