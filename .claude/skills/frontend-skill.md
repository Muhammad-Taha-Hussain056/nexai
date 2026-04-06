---
name: frontend-skill
description: Deep reference skill for NexusAI frontend patterns — page templates, MUI theming, service layer wiring, auth-aware components, and responsive layout conventions. Load this skill when building or modifying any Next.js page or component.
---

# NexusAI Frontend Skill

## 1. Page Template (`app/<route>/page.tsx`)

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from '@/components/layout/Navbar';

export default function ExamplePage() {
  return (
    // pt: '72px' accounts for the fixed Navbar height
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', pt: '72px' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={900}>Page Title</Typography>
      </Container>
    </Box>
  );
}
```

## 2. Full-Viewport Layout (Chat / Discover / Agents)

```tsx
<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', pt: '72px' }}>
  <Navbar />
  <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
    {/* Sidebar */}
    <Box sx={{ width: 320, borderRight: '1px solid #EDEDED', overflowY: 'auto', flexShrink: 0 }}>
      {/* sidebar items */}
    </Box>
    {/* Main Panel */}
    <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
      {/* content */}
    </Box>
  </Box>
</Box>
```

## 3. Fetching from Backend

```tsx
// services/modelService.ts
import { fetchAllModels, fetchAgents, FoundationModel, Agent } from '@/services/modelService';

const [models, setModels] = useState<FoundationModel[]>([]);
const [loading, setLoading]  = useState(true);

useEffect(() => {
  async function load() {
    try {
      const res = await fetchAllModels();
      setModels(res.models.slice(0, 3));
    } catch {
      setModels(fallbackData);  // always provide a local JSON fallback
    } finally {
      setLoading(false);
    }
  }
  void load();
}, []);
```

## 4. Auth-Aware Pattern

```tsx
import { useStore } from '@/store/useStore';

const { user, logout } = useStore();

// Conditionally render based on auth state
{user ? <UserMenu user={user} onLogout={logout} /> : <SignInButton />}
```

## 5. Design Tokens

```tsx
// Primary CTA button
<Button sx={{ bgcolor: '#D46F35', '&:hover': { bgcolor: '#B3511D' }, borderRadius: 1.5, fontWeight: 800 }}>
  Action
</Button>

// Outlined secondary
<Button variant="outlined" sx={{ borderColor: '#E5E7EB', color: '#111827', borderRadius: 1.5 }}>
  Secondary
</Button>

// Card with hover lift
<Paper sx={{
  border: '1px solid #E5E7EB',
  borderRadius: 2,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': { borderColor: '#D46F35', transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }
}}>
```

## 6. Responsive Grid

```tsx
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }, gap: 3 }}>
  {items.map(item => <Card key={item.id} {...item} />)}
</Box>
```

## 7. Horizontal Scroll Row (tabs / chips)

```tsx
<Box sx={{
  display: 'flex', gap: 2, overflowX: 'auto', pb: 1.5,
  '&::-webkit-scrollbar': { height: 4 },
  '&::-webkit-scrollbar-thumb': { bgcolor: '#E5E7EB', borderRadius: 4 },
}}>
  {items.map(item => (
    <Button key={item} sx={{ minWidth: 'max-content', flexShrink: 0, whiteSpace: 'nowrap' }}>
      {item}
    </Button>
  ))}
</Box>
```

## 8. Deep-Link to Research Feed

```tsx
// Linking from Home → Discover with a specific item pre-selected
<Link href={`/discover?id=${researchItem.id}`}>Read More</Link>

// In discover/page.tsx, reading the param:
const searchParams = useSearchParams();
const targetId = searchParams.get('id');
```

## 9. Snackbar Notification Pattern

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Action</Button>

<Snackbar open={open} autoHideDuration={5000} onClose={() => setOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
  <Alert severity="success" variant="filled" sx={{ fontWeight: 700 }}>
    Action completed successfully!
  </Alert>
</Snackbar>
```

## 10. JSX Special Characters

| Character | JSX Safe |
|---|---|
| `'` | `&apos;` |
| `>` | `&gt;` |
| `<` | `&lt;` |
| `&` | `&amp;` |
