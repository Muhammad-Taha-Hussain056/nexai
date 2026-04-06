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
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WindowIcon from '@mui/icons-material/Window';

// ─── Data ────────────────────────────────────────────────────────────────────

const templates = [
  {
    emoji: '🔍',
    title: 'Research Agent',
    desc: 'Automates web research, summarises findings, and generates structured reports.',
    tags: ['GPT-5.4', 'Web search'],
  },
  {
    emoji: '💼',
    title: 'Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues.',
    tags: ['GPT-5.4', 'Ticketing'],
  },
  {
    emoji: '💻',
    title: 'Code Review Agent',
    desc: 'Reviews PRs, flags bugs, and suggests improvements.',
    tags: ['Claude Opus 4.6', 'GitHub'],
  },
  {
    emoji: '📊',
    title: 'Data Analysis Agent',
    desc: 'Processes spreadsheets and generates visual insights.',
    tags: ['Gemini', 'Sheets'],
  },
  {
    emoji: '📝',
    title: 'Content Writer Agent',
    desc: 'Creates blog posts and marketing copy with brand voice.',
    tags: ['Claude Opus 4.6', 'Marketing'],
  },
];

const checklistItems = [
  'Dashboard Layout Adjustments',
  'Design agent system pr...',
  'Configure tool integrati...',
];

const useCaseTabs = [
  'Build a business',
  'Help me learn',
  'Monitor the situation',
  'Research',
  'Create content',
  'Analyze & research'
];

const suggestions = [
  { icon: '🚀', text: 'Build a space exploration timeline app', color: '#FCE7F3' },
  { icon: '📊', text: 'Create a real-time stock market tracker', color: '#E0E7FF' },
  { icon: '🤖', text: 'Prototype an AI chatbot demo application', color: '#F3E8FF' },
  { icon: '📋', text: 'Create a project management Kanban board', color: '#FFEDD5' },
];

export default function AgentsPage() {
  const [input, setInput] = useState('');

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', overflow: 'hidden' }}>
      {/* Top Navigation */}
      <Navbar />

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        
        {/* Left Sidebar */}
        <Box
          sx={{
            width: 300,
            borderRight: '1px solid #E5E7EB',
            bgcolor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            flexShrink: 0,
            p: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#D46F35', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <SmartToyIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#111827" lineHeight={1.2}>
                Agent Builder
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.4 }}>
                Create powerful AI agents using any model. Pick a template or start from scratch.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#D46F35',
              color: 'white',
              borderRadius: 6,
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              mb: 4,
              '&:hover': { bgcolor: '#B3511D' }
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
              borderRadius: 4,
              p: 2.5,
              mb: 4,
            }}
          >
            <Typography variant="body2" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: '#111827' }}>
              <AutoAwesomeIcon sx={{ fontSize: '1rem', color: '#D46F35' }}/> Not sure where to start?
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5, lineHeight: 1.5 }}>
              Chat with our AI guide — describe what you want your agent to do and get a personalized setup plan.
            </Typography>
            <Button
              variant="contained"
              disableElevation
              size="small"
              sx={{
                bgcolor: '#FFFFFF',
                color: '#111827',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: '#F9FAFB' }
              }}
            >
              Ask the Hub →
            </Button>
          </Paper>

          {/* Task Queue */}
          <Button
            variant="contained"
            disableElevation
            fullWidth
            sx={{
              bgcolor: '#F3F4F6',
              color: '#111827',
              borderRadius: 6,
              py: 0.75,
              fontWeight: 600,
              textTransform: 'none',
              mb: 2,
              justifyContent: 'flex-start',
              '&:hover': { bgcolor: '#E5E7EB' }
            }}
          >
            <Box sx={{ width: 20, height: 20, mr: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</Box>
            New Task
          </Button>

          <Stack spacing={0.5}>
            {checklistItems.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', px: 1, opacity: 0.7 }}>
                <Checkbox size="small" disableRipple sx={{ p: 0.5, color: '#D1D5DB' }} />
                <Typography variant="caption" noWrap sx={{ color: '#4B5563', fontWeight: 500, ml: 1 }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <Box sx={{ width: '100%', maxWidth: 1000, mx: 'auto', px: { xs: 4, lg: 6 }, pt: { xs: 6, md: 10 }, pb: 8 }}>
            
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h3" fontWeight={800} letterSpacing="-1px" sx={{ color: '#111827', mb: 1.5 }}>
                Agent works <Box component="span" sx={{ color: '#D46F35' }}>for you.</Box>
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your AI agent takes care of everything, end to end.
              </Typography>
            </Box>

            {/* Massive Input Block */}
            <Paper elevation={0} sx={{ borderRadius: '40px', border: '1px solid #E5E7EB', px: 4, py: 2, mb: 3, bgcolor: '#F9FAFB' }}>
              <TextField 
                fullWidth 
                multiline 
                minRows={2} 
                maxRows={6} 
                variant="standard" 
                placeholder="What should we work on next?" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                sx={{ mb: 2 }}
                InputProps={{ 
                  disableUnderline: true, 
                  sx: { fontSize: '1.05rem', px: 1, py: 1, color: '#111827', fontWeight: 500, '& textarea::placeholder': { color: '#9CA3AF', opacity: 1 } } 
                }} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid #E5E7EB', px: 1 }}>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ pt: 1 }}>
                  <IconButton size="small" sx={{ color: '#A78BFA', '&:hover': { bgcolor: '#EDE9FE' } }}><MicNoneIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#FCD34D', '&:hover': { bgcolor: '#FEF3C7' } }}><FileUploadOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#60A5FA', '&:hover': { bgcolor: '#DBEAFE' } }}><VideoCallOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#34D399', '&:hover': { bgcolor: '#D1FAE5' } }}><ImageOutlinedIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#F472B6', '&:hover': { bgcolor: '#FCE7F3' } }}><AttachFileIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: '#9CA3AF', '&:hover': { bgcolor: '#F3F4F6' } }}><AddIcon fontSize="small" /></IconButton>
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1 }}>
                  <Typography variant="caption" color="text.disabled" fontWeight={600}>Agent</Typography>
                  <IconButton sx={{ bgcolor: '#D46F35', color: 'white', width: 44, height: 44, '&:hover': { bgcolor: '#B3511D' } }}>
                    <SendIcon sx={{ fontSize: '1rem', ml: 0.5 }} />
                  </IconButton>
                </Box>
              </Box>
            </Paper>

            {/* Prompt Tabs Row */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 4, '&::-webkit-scrollbar': { display: 'none' } }}>
              <Button
                variant="contained"
                disableElevation
                startIcon={<WindowIcon />}
                sx={{
                  borderRadius: 6,
                  bgcolor: '#111827',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 0.5,
                  px: 2,
                  '&:hover': { bgcolor: '#374151' },
                }}
              >
                Use cases
              </Button>
              {useCaseTabs.map((tab) => (
                <Button
                  key={tab}
                  variant="outlined"
                  sx={{
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    color: 'text.secondary',
                    borderColor: '#E5E7EB',
                    textTransform: 'none',
                    fontWeight: 500,
                    py: 0.5,
                    px: 2,
                    '&:hover': { bgcolor: '#F9FAFB', borderColor: '#D1D5DB' }
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>

            {/* Suggestions Divider List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
              {suggestions.map((s, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, borderTop: '1px solid #F3F4F6' }}>
                  <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    {s.icon}
                  </Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>{s.text}</Typography>
                </Box>
              ))}
              <Box sx={{ pt: 2, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, cursor: 'pointer', '&:hover': { color: '#111827' } }}>
                  View all suggestions {'>'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: '#111827' } }}>
                  <AutoAwesomeIcon sx={{ fontSize: '0.8rem' }} /> Shuffle
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#F3F4F6' }} />

            {/* Templates Horizontal Row */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3 }}>
              <Typography variant="overline" fontWeight={800} color="#9CA3AF" sx={{ letterSpacing: 1 }}>
                AGENT TEMPLATES
              </Typography>
              <Box sx={{ bgcolor: '#F3F4F6', color: '#9CA3AF', borderRadius: 1, px: 0.75, py: 0.25, fontSize: '0.7rem', fontWeight: 800 }}>6</Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
              {templates.map((tpl, i) => (
                <Paper key={i} elevation={0} sx={{ minWidth: 260, flexShrink: 0, p: 2.5, border: '1px solid #E5E7EB', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Typography variant="body1" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tpl.emoji} {tpl.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.5 }}>
                    {tpl.desc}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {tpl.tags.map(tag => (
                      <Box key={tag} sx={{ bgcolor: '#F9FAFB', color: tag.includes('GPT') ? '#3B82F6' : tag.includes('Claude') ? '#10B981' : '#D46F35', fontWeight: 800, fontSize: '0.65rem', px: 1, py: 0.25, borderRadius: 1 }}>
                        {tag}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              ))}
              
              {/* Build from Scratch Card */}
              <Paper elevation={0} sx={{ minWidth: 260, flexShrink: 0, p: 2.5, border: '2px dashed #FFE8DC', bgcolor: '#FFF4ED', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, cursor: 'pointer', '&:hover': { bgcolor: '#FFE8DC' } }}>
                <Typography sx={{ color: '#D46F35', fontWeight: 800 }}>+</Typography>
                <Typography variant="caption" fontWeight={800} sx={{ color: '#D46F35' }}>
                  Build from Scratch
                </Typography>
              </Paper>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
