// src/services/api.js
// Cleaned, Vite-ready ApiService singleton

class ApiService {
  constructor() {
  this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  this.token = (typeof window !== 'undefined') ? localStorage.getItem('authToken') : null;
  
  
  // Simple in-memory cache
  this.cache = new Map();
  this.cacheExpiry = new Map();
  }
  
  
  // ------------------ token helpers ------------------
  setToken(token) {
  this.token = token;
  if (typeof window !== 'undefined') localStorage.setItem('authToken', token);
  }
  
  
  clearToken() {
  this.token = null;
  if (typeof window !== 'undefined') localStorage.removeItem('authToken');
  }
  
  
  getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
  return headers;
  }
  
  
  // ------------------ low-level request ------------------
  async request(endpoint, options = {}) {
  const url = `${this.baseURL}${endpoint}`;
  
  
  const config = {
  ...options,
  headers: {
  ...this.getAuthHeaders(),
  ...(options.headers || {})
  }
  };
  try {
    console.log(`API -> ${config.method || 'GET'} ${url}`);
    const response = await fetch(url, config);
    
    
    if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    
    if (response.status === 204) return null; // no content
    const data = await response.json().catch(() => null);
    return data;
    } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new Error('Network error - please check your connection');
    }
    throw error;
    }
    }
    // ------------------ retry + cache helpers ------------------
async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
  return await this.request(endpoint, options);
  } catch (error) {
  lastError = error;
  if (error.message.includes('401') || error.message.includes('403')) throw error;
  if (attempt < maxRetries) {
  const delay = Math.pow(2, attempt) * 1000;
  await new Promise(r => setTimeout(r, delay));
  }
  }
  }
  throw lastError;
  }
  
  
  getCacheKey(endpoint, params) {
  return `${endpoint}_${JSON.stringify(params || {})}`;
  }
  setCache(key, data, ttlMinutes = 5) {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttlMinutes * 60 * 1000);
    }
    
    
    getCache(key) {
    if (!this.cache.has(key)) return null;
    const expiry = this.cacheExpiry.get(key);
    if (Date.now() < expiry) return this.cache.get(key);
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
    return null;
    }
    
    
    async requestWithCache(endpoint, options = {}, cacheTTL = 5) {
    const cacheKey = this.getCacheKey(endpoint, options);
    if (!options.method || options.method === 'GET') {
    const cached = this.getCache(cacheKey);
    if (cached) return cached;
    }
    
    
    const res = await this.request(endpoint, options);
    
    
    if (!options.method || options.method === 'GET') {
    this.setCache(cacheKey, res, cacheTTL);
    }
    
    
    return res;
    }
    // ------------------ AUTH ------------------
async register(userData) {
  try {
  const response = await this.request('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email: userData.email, password: userData.password, name: userData.name })
  });
  if (response?.token) this.setToken(response.token);
  return { success: true, user: response.user, token: response.token };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  
  
  async login(email, password) {
  try {
  const response = await this.request('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
  });
  if (response?.token) this.setToken(response.token);
  return { success: true, user: response.user, token: response.token };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  async logout() {
    try {
    await this.request('/api/auth/logout', { method: 'POST' });
    } catch (error) {
    console.log('Logout notify failed:', error);
    }
    this.clearToken();
    return { success: true };
    }
    
    
    async getCurrentUser() {
    try {
    const response = await this.request('/api/auth/me');
    return { success: true, user: response.user };
    } catch (error) {
    this.clearToken();
    return { success: false, error: error.message };
    }
    }
    
    
    // ------------------ PROGRESSIONS ------------------
    async generateProgression(config) {
    try {
    const response = await this.request('/api/progressions/generate', {
    method: 'POST',
    body: JSON.stringify({
    startChord: config.startChord,
    endChord: config.endChord,
    length: config.length || 4,
    style: config.style || 'jazz',
    key: config.key || 'C',
    complexity: config.complexity || 'intermediate'
    })
    });
    return { success: true, progression: response.progression, analysis: response.analysis || response.tensionAnalysis, voicings: response.voicings, metadata: response.metadata };
} catch (error) {
return { success: false, error: error.message };
}
}


async saveProgression(progressionData) {
try {
const response = await this.request('/api/progressions/save', {
method: 'POST',
body: JSON.stringify({ name: progressionData.name, chords: progressionData.chords, style: progressionData.style, isPublic: progressionData.isPublic || false, tags: progressionData.tags || [] })
});


return { success: true, progression: response.progression };
} catch (error) {
return { success: false, error: error.message };
}
}
async getUserProgressions() {
  try {
  const response = await this.request('/api/progressions/my');
  return { success: true, progressions: response.progressions };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  
  
  async deleteProgression(progressionId) {
  try {
  await this.request(`/api/progressions/${progressionId}`, { method: 'DELETE' });
  return { success: true };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  // ------------------ MELODY ------------------
async generateMelodicPath(config) {
  try {
  const response = await this.request('/api/melody/generate', {
  method: 'POST',
  body: JSON.stringify({ startNote: config.startNote, endNote: config.endNote, scaleType: config.scaleType, chordContext: config.chordContext, length: config.length || 8 })
  });
  return { success: true, path: response.melodicPath, analysis: response.analysis, suggestions: response.suggestions };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  
  
  // ------------------ COMMUNITY ------------------
  async getCommunityProgressions(filters = {}) {
  try {
  const queryParams = new URLSearchParams({ page: filters.page || 1, limit: filters.limit || 20, style: filters.style || '', difficulty: filters.difficulty || '', sort: filters.sort || 'popular' }).toString();
  const response = await this.request(`/api/community/progressions?${queryParams}`);
  return { success: true, progressions: response.progressions, total: response.total, hasMore: response.hasMore };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  async likeProgression(progressionId) {
    try {
    const response = await this.request(`/api/community/progressions/${progressionId}/like`, { method: 'POST' });
    return { success: true, likes: response.likes };
    } catch (error) {
    return { success: false, error: error.message };
    }
    }
    
    
    async shareProgression(progressionId, platform) {
    try {
    const response = await this.request(`/api/community/progressions/${progressionId}/share`, { method: 'POST', body: JSON.stringify({ platform }) });
    return { success: true, shareUrl: response.shareUrl };
    } catch (error) {
    return { success: false, error: error.message };
    }
    }
    
    
    // ------------------ PRACTICE & ANALYTICS ------------------
    async recordPracticeSession(sessionData) {
    try {
    const response = await this.request('/api/practice/session', { method: 'POST', body: JSON.stringify({ progression: sessionData.progression, duration: sessionData.duration, accuracy: sessionData.accuracy, tempo: sessionData.tempo, practiceType: sessionData.practiceType, timestamp: new Date().toISOString() }) });
    return { success: true, session: response.session };
    } catch (error) {
    return { success: false, error: error.message };
    }
    }
    async getUserStats() {
      try {
      const response = await this.request('/api/user/stats');
      return { success: true, stats: { totalProgressions: response.totalProgressions, practiceHours: response.practiceHours, favoriteStyle: response.favoriteStyle, skillLevel: response.skillLevel, achievements: response.achievements, recentActivity: response.recentActivity } };
      } catch (error) {
      return { success: false, error: error.message };
      }
      }
      
      
      async getAnalytics() {
      try {
      const response = await this.request('/api/analytics/dashboard');
      return { success: true, analytics: response.analytics };
      } catch (error) {
      return { success: false, error: error.message };
      }
      }
      
      
      // ------------------ BILLING ------------------
      async createSubscription(planType) {
      try {
      const response = await this.request('/api/billing/subscribe', { method: 'POST', body: JSON.stringify({ planType, paymentMethod: 'stripe' }) });
      return { success: true, subscriptionId: response.subscriptionId, clientSecret: response.clientSecret };
      } catch (error) {
      return { success: false, error: error.message };
      }
      }
      async cancelSubscription() {
        try {
        await this.request('/api/billing/cancel', { method: 'POST' });
        return { success: true };
        } catch (error) {
        return { success: false, error: error.message };
        }
        }
        
        
        async getBillingHistory() {
        try {
        const response = await this.request('/api/billing/history');
        return { success: true, invoices: response.invoices };
        } catch (error) {
        return { success: false, error: error.message };
        }
        }
        // ------------------ UTIL ------------------
async uploadFile(file, type) {
  try {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  
  const response = await fetch(`${this.baseURL}/api/upload`, {
  method: 'POST',
  headers: { 'Authorization': this.token ? `Bearer ${this.token}` : undefined },
  body: formData
  });
  
  
  if (!response.ok) throw new Error('Upload failed');
  const data = await response.json();
  return { success: true, fileUrl: data.fileUrl };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  
  
  async reportBug(bugData) {
  try {
  const response = await this.request('/api/support/bug-report', { method: 'POST', body: JSON.stringify({ description: bugData.description, steps: bugData.steps, userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '', url: typeof window !== 'undefined' ? window.location.href : '', timestamp: new Date().toISOString() }) });
  return { success: true, ticketId: response.ticketId };
  } catch (error) {
  return { success: false, error: error.message };
  }
  }
  
  
  // ------------------ OFFLINE ------------------
  getOfflineData() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('offlineProgressions');
  return data ? JSON.parse(data) : [];
  }
  saveOfflineProgression(progression) {
    if (typeof window === 'undefined') return;
    const existing = this.getOfflineData();
    existing.push({ ...progression, createdAt: new Date().toISOString(), offline: true });
    localStorage.setItem('offlineProgressions', JSON.stringify(existing));
    }
    
    
    clearOfflineData() {
    if (typeof window !== 'undefined') localStorage.removeItem('offlineProgressions');
    }
    
    
    async syncOfflineData() {
    const offlineData = this.getOfflineData();
    if (!offlineData.length) return { success: true, synced: [] };
    try {
    const response = await this.request('/api/sync/offline-data', { method: 'POST', body: JSON.stringify({ data: offlineData }) });
    this.clearOfflineData();
    return { success: true, synced: response.syncedItems };
    } catch (error) {
    return { success: false, error: error.message };
    }
    }
    }
    const api = new ApiService();
export default api;