
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

export interface ModelResponse {
  collection: string;
  version: string;
  changes: Array<{
    changeId: string;
    type: string;
    description: string;
    effectiveAt: string;
  }>;
  promptGuide: Array<{
    title: string;
    template: string;
  }>;
  models: FoundationModel[];
}

export interface ResearchItem {
  id: string;
  date: string;
  organization: string;
  category: string;
  title: string;
  summary: string;
  citation?: string;
  overview?: string;
  arxivId?: string;
  metrics?: Record<string, string | number>;
  keyFindings?: string[];
  impactAssessment?: string;
  modelReferences: string[];
}

export interface ResearchFeedResponse {
  feedTitle: string;
  updatedAt: string;
  items: ResearchItem[];
}

export interface ResearchModelReferencesResponse {
  researchItemId: string;
  title: string;
  modelReferences: FoundationModel[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tags: string[];
}

export interface AgentsResponse {
  collection: string;
  count: number;
  agents: Agent[];
}

const BACKEND_URL = 'http://localhost:3001/api';

export async function fetchAllModels(): Promise<ModelResponse> {
  const response = await fetch(`${BACKEND_URL}/models`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch models from marketplace backend');
  }
  
  return response.json();
}

export async function fetchAgents(): Promise<AgentsResponse> {
  const response = await fetch(`${BACKEND_URL}/agents`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch agents from backend');
  }
  
  return response.json();
}

export async function fetchResearchFeed(): Promise<ResearchFeedResponse> {
  const response = await fetch(`${BACKEND_URL}/research-feed`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch research feed from backend');
  }
  
  return response.json();
}

export async function fetchModelReferences(researchItemId: string): Promise<ResearchModelReferencesResponse> {
  const response = await fetch(`${BACKEND_URL}/research-feed/${researchItemId}/model-references`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch model references for research item');
  }
  
  return response.json();
}
