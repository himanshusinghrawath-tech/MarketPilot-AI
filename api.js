// MarketPilot API Client

const BASE_URL = '/api';

// --- AUTHENTICATION HELPERS ---
const AUTH_TOKEN_KEY = 'marketpilot_auth_token';
const AUTH_USER_KEY = 'marketpilot_auth_user';

export function getStoredAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredAuth(token, user) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to store auth session:', e);
  }
}

export function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Invalid email or password');
    }
    setStoredAuth(data.token, data.user);
    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function registerUser(name, email, password, company = '', role = 'Market Strategist') {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, company, role })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Registration failed');
    }
    setStoredAuth(data.token, data.user);
    return { success: true, user: data.user, token: data.token };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function requestPasswordReset(email) {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to request password reset');
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function resetUserPassword(token, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Password reset failed');
    }
    if (data.token && data.user) {
      setStoredAuth(data.token, data.user);
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function verifyCurrentUser() {
  const token = getStoredAuthToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      clearStoredAuth();
      return null;
    }
    const data = await res.json();
    if (data.user) {
      setStoredAuth(token, data.user);
      return data.user;
    }
    return null;
  } catch (err) {
    // If backend is momentarily unreachable, use stored user
    return getStoredUser();
  }
}



export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    console.warn('API health check offline, using local fallback mode:', err);
    return {
      status: 'local-fallback',
      service: 'MarketPilot AI Orchestrator',
      version: '4.19',
      serpapi_connected: false,
      feed_status: 'Demo Mode',
      latency_ms: 24,
      uptime: '99.8%'
    };
  }
}

export async function fetchConfig() {
  try {
    const res = await fetch(`${BASE_URL}/config`);
    if (!res.ok) throw new Error('Config fetch failed');
    return await res.json();
  } catch (err) {
    return {
      serpapi_configured: false,
      serpapi_key_masked: '',
      llm_configured: false,
      mode: 'Demo Mode (Local)'
    };
  }
}

export async function updateConfig(keys) {
  try {
    const res = await fetch(`${BASE_URL}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys)
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to update config:', err);
    return { success: false, message: err.message };
  }
}

export async function runAnalysis(payload) {
  try {
    const res = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Analysis run failed with status ${res.status}`);
    const data = await res.json();
    if (data && data.category && data.scores) {
      return data;
    }
    return getLocalFallbackAnalysis(payload);
  } catch (err) {
    console.warn('API backend not reachable or error occurred, using dynamic simulation:', err);
    return getLocalFallbackAnalysis(payload);
  }
}

export async function fetchAnalysesHistory() {
  try {
    const res = await fetch(`${BASE_URL}/analyses`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return await res.json();
  } catch (err) {
    return getLocalFallbackHistory();
  }
}

export async function fetchAnalysisById(id) {
  try {
    const res = await fetch(`${BASE_URL}/analyses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch analysis');
    return await res.json();
  } catch (err) {
    return getLocalFallbackAnalysis({ id });
  }
}

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Known cities & neighborhood hub coordinates
export const CITY_COORDS = {
  // Mumbai Micro-Neighborhoods & Hubs
  "bandra west": [19.0596, 72.8295],
  "bandra east": [19.0607, 72.8515],
  bandra: [19.0596, 72.8295],
  "pali hill": [19.0620, 72.8280],
  "hill road": [19.0552, 72.8365],
  khar: [19.0700, 72.8338],
  santacruz: [19.0805, 72.8410],
  juhu: [19.1075, 72.8263],
  "andheri west": [19.1363, 72.8277],
  "andheri east": [19.1136, 72.8697],
  andheri: [19.1136, 72.8697],
  powai: [19.1176, 72.9060],
  "lower parel": [19.0016, 72.8287],
  worli: [19.0166, 72.8166],
  colaba: [18.9067, 72.8147],
  fort: [18.9322, 72.8338],
  dadar: [19.0178, 72.8478],
  malad: [19.1860, 72.8485],
  borivali: [19.2307, 72.8567],
  thane: [19.2183, 72.9781],
  "navi mumbai": [19.0330, 73.0297],
  mumbai: [19.0760, 72.8777],
  bombay: [19.0760, 72.8777],

  // Bangalore Neighborhoods & Hubs
  "hennur main road": [13.0209, 77.6299],
  "hennur main rd": [13.0209, 77.6299],
  "hennur road": [13.0209, 77.6299],
  hennur: [13.0209, 77.6299],
  "kalyan nagar": [13.0226, 77.6396],
  "hrbr layout": [13.0226, 77.6396],
  kammanahalli: [13.0143, 77.6364],
  kothanur: [13.0575, 77.6443],
  banaswadi: [13.0081, 77.6418],
  koramangala: [12.9352, 77.6245],
  indiranagar: [12.9784, 77.6408],
  whitefield: [12.9698, 77.7500],
  "hsr layout": [12.9121, 77.6446],
  hsr: [12.9121, 77.6446],
  bellandur: [12.9304, 77.6784],
  "sarjapur road": [12.9103, 77.6845],
  sarjapur: [12.9103, 77.6845],
  jayanagar: [12.9308, 77.5838],
  "jp nagar": [12.9063, 77.5857],
  "btm layout": [12.9166, 77.6101],
  btm: [12.9166, 77.6101],
  "mg road": [12.9756, 77.6066],
  "brigade road": [12.9727, 77.6075],
  "ub city": [12.9716, 77.5946],
  marathahalli: [12.9591, 77.6974],
  "electronic city": [12.8452, 77.6602],
  malleshwaram: [13.0031, 77.5643],
  rajajinagar: [12.9982, 77.5530],
  hebbal: [13.0358, 77.5970],
  yelahanka: [13.1007, 77.5963],
  "frazer town": [12.9972, 77.6145],
  "richmond town": [12.9663, 77.6045],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],

  // Delhi NCR Neighborhoods
  "hauz khas": [28.5494, 77.2001],
  "green park": [28.5589, 77.2028],
  "connaught place": [28.6315, 77.2167],
  cp: [28.6315, 77.2167],
  saket: [28.5244, 77.2155],
  "greater kailash": [28.5390, 77.2345],
  gk: [28.5390, 77.2345],
  "vasant kunj": [28.5298, 77.1541],
  "defence colony": [28.5727, 77.2307],
  "khan market": [28.6003, 77.2270],
  "cyber city": [28.4952, 77.0895],
  "dlf phase": [28.4912, 77.0945],
  "sector 29": [28.4682, 77.0620],
  gurgaon: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  "noida sector 18": [28.5708, 77.3261],
  noida: [28.5355, 77.3910],
  delhi: [28.6139, 77.2090],
  "new delhi": [28.6139, 77.2090],

  // Hyderabad Neighborhoods
  "jubilee hills": [17.4319, 78.4073],
  "banjara hills": [17.4156, 78.4350],
  gachibowli: [17.4401, 78.3489],
  "hitec city": [17.4474, 78.3762],
  madhapur: [17.4483, 78.3915],
  kondapur: [17.4699, 78.3578],
  hyderabad: [17.3850, 78.4867],

  // Pune Neighborhoods
  "koregaon park": [18.5362, 73.8940],
  "viman nagar": [18.5679, 73.9143],
  "kalyani nagar": [18.5487, 73.9037],
  kothrud: [18.5074, 73.8077],
  baner: [18.5590, 73.7868],
  hinjewadi: [18.5913, 73.7389],
  pune: [18.5204, 73.8567],

  // Other Major Metros
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  chandigarh: [30.7333, 76.7794],
  goa: [15.2993, 74.1240],
  kochi: [9.9312, 76.2673],

  // International
  london: [51.5074, -0.1278],
  "new york": [40.7128, -74.0060],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  "san francisco": [37.7749, -122.4194]
};

export function getCoords(loc) {
  const l = String(loc || "").toLowerCase();
  const sortedKeys = Object.keys(CITY_COORDS).sort((a, b) => b.length - a.length);
  for (const c of sortedKeys) {
    if (l.includes(c)) return CITY_COORDS[c];
  }
  return [19.0596, 72.8295]; // Default to Bandra West
}

// Resilient, dynamic local simulation data adapted to user's category & location
export function getLocalFallbackAnalysis(params = {}) {
  const safeParams = params || {};
  const category = safeParams.category || 'Specialty Coffee Shop';
  const location = safeParams.location || 'Bandra West, Mumbai, India';
  const subLocation = safeParams.sub_location || 'Pali Hill & Perry Road';
  const radius = safeParams.radius_km || 3.0;
  const city = String(location).split(',')[0].trim() || 'Central';
  
  const fullLoc = subLocation && !location.toLowerCase().includes(subLocation.toLowerCase())
    ? `${subLocation}, ${location}`
    : location;

  const [baseLat, baseLng] = getCoords(fullLoc);

  const catLower = String(category).toLowerCase();
  const locLower = String(fullLoc).toLowerCase();

  let avgPrice = 280;
  let minPrice = 140;
  let maxPrice = 600;
  let priceUnit = "";

  if (catLower.includes('gym') || catLower.includes('fitness') || catLower.includes('crossfit')) {
    avgPrice = 2800; minPrice = 1500; maxPrice = 5000; priceUnit = "/mo";
  } else if (catLower.includes('cowork') || catLower.includes('office')) {
    avgPrice = 7500; minPrice = 4500; maxPrice = 14000; priceUnit = "/desk";
  } else if (catLower.includes('bakery') || catLower.includes('cake')) {
    avgPrice = 220; minPrice = 90; maxPrice = 450;
  } else if (catLower.includes('gaming') || catLower.includes('esports') || catLower.includes('arcade') || catLower.includes('cyber')) {
    avgPrice = 150; minPrice = 90; maxPrice = 240; priceUnit = "/hr";
  } else if (catLower.includes('coffee') || catLower.includes('cafe')) {
    avgPrice = 210; minPrice = 120; maxPrice = 350;
  }

  // Realistic competitor templates
  let compTemplates = [];
  let streets = [];

  if (locLower.includes('bandra') || locLower.includes('mumbai')) {
    streets = ["Chapel Road, Bandra West", "Perry Road, Bandra West", "Pali Village, Bandra West", "Hill Road, Bandra West", "Waterfield Road, Bandra West", "16th Road, Bandra West"];
    if (catLower.includes('coffee') || catLower.includes('cafe')) {
      compTemplates = [
        { name: "Subko Specialty Coffee & Bakehouse", type: "Specialty Coffee Roaster", rating: 4.7, reviews: 1840, price: "₹180–₹320" },
        { name: "Third Wave Coffee Flagship", type: "Chain Specialty Cafe", rating: 4.4, reviews: 3410, price: "₹220–₹340" },
        { name: "Araku Single-Origin Boutique", type: "Single-Origin Boutique", rating: 4.6, reviews: 1280, price: "₹280–₹460" },
        { name: "Blue Tokai Coffee Roasters", type: "Artisanal Coffee Bar", rating: 4.5, reviews: 2190, price: "₹190–₹290" },
        { name: "Grey Soul Coffee Roasters", type: "Experiential Coffeehouse", rating: 4.6, reviews: 980, price: "₹200–₹320" },
        { name: "abcoffee Express Roastery", type: "Quick-Service Espresso Bar", rating: 4.3, reviews: 760, price: "₹120–₹210" }
      ];
    }
  } else if (locLower.includes('koramangala') || locLower.includes('indiranagar') || locLower.includes('bangalore')) {
    streets = ["80 Feet Road, Koramangala 4th Block", "100 Feet Road, Indiranagar", "5th Block, Koramangala", "12th Main, Indiranagar", "Koramangala 6th Block", "CMH Road, Indiranagar"];
    if (catLower.includes('coffee') || catLower.includes('cafe')) {
      compTemplates = [
        { name: "Third Wave Coffee Flagship", type: "Chain Specialty Cafe", rating: 4.5, reviews: 3820, price: "₹210–₹340" },
        { name: "Araku Coffee Flagship", type: "Single-Origin Boutique", rating: 4.7, reviews: 2940, price: "₹290–₹480" },
        { name: "Blue Tokai Coffee Roasters", type: "Artisanal Coffee Bar", rating: 4.5, reviews: 2410, price: "₹190–₹290" },
        { name: "Nerlu Curated Coffee Bar", type: "Curated Multi-Roaster", rating: 4.6, reviews: 1120, price: "₹170–₹270" },
        { name: "Roastery Coffee House", type: "Garden Estate Cafe", rating: 4.6, reviews: 2890, price: "₹240–₹380" },
        { name: "Maverick & Farmer Artisanal Cafe", type: "Experiential Coffeehouse", rating: 4.4, reviews: 930, price: "₹200–₹310" }
      ];
    }
  }

  if (compTemplates.length === 0) {
    streets = [f => `High Street, ${city}`, f => `Market Road, ${city}`, f => `Central Avenue, ${city}`, f => `Commercial Hub, ${city}`, f => `North Boulevard, ${city}`, f => `Station Road, ${city}`].map(fn => fn());
    compTemplates = [
      { name: `Apex ${category} Hub`, type: `Premier ${category}`, rating: 4.6, reviews: 1180, price: `₹${avgPrice * 0.9}–₹${avgPrice * 1.3}${priceUnit}` },
      { name: `The ${category} Studio`, type: `Boutique ${category}`, rating: 4.5, reviews: 840, price: `₹${avgPrice}–₹${avgPrice * 1.4}${priceUnit}` },
      { name: `Urban ${category} Center`, type: `Commercial ${category}`, rating: 4.3, reviews: 2150, price: `₹${avgPrice * 0.7}–₹${avgPrice * 1.1}${priceUnit}` },
      { name: `${city} ${category} Lab`, type: `Artisanal ${category}`, rating: 4.7, reviews: 920, price: `₹${avgPrice * 1.1}–₹${avgPrice * 1.6}${priceUnit}` },
      { name: `Prime ${category} Co.`, type: `Full-Service ${category}`, rating: 4.4, reviews: 1390, price: `₹${avgPrice * 0.8}–₹${avgPrice * 1.2}${priceUnit}` },
      { name: `Express ${category} & Retail`, type: `Express ${category}`, rating: 4.2, reviews: 670, price: `₹${avgPrice * 0.6}–₹${avgPrice * 0.95}${priceUnit}` }
    ];
  }

  const offsets = [
    [-0.0052, 0.0048],
    [0.0061, 0.0035],
    [-0.0041, -0.0051],
    [0.0038, -0.0062],
    [0.0075, 0.0068],
    [-0.0078, 0.0019]
  ];

  const competitors = compTemplates.map((comp, i) => {
    const [dlat, dlng] = offsets[i % offsets.length];
    const lat = Number((baseLat + dlat).toFixed(6));
    const lng = Number((baseLng + dlng).toFixed(6));
    const distKm = haversineDistanceKm(baseLat, baseLng, lat, lng);
    const p = Math.round(avgPrice * (0.85 + (i * 0.08)));
    const street = streets[i % streets.length];

    return {
      id: `comp-${i + 1}`,
      name: comp.name,
      location: street,
      rating: comp.rating,
      reviews: comp.reviews,
      price: comp.price || `₹${p}${priceUnit}`,
      price_num: p,
      distance: `${distKm} km`,
      distance_km: distKm,
      opportunity: i % 2 === 0 ? "High (Underserved hours)" : "Medium",
      lat,
      lng,
      type: comp.type,
      open_state: i === 1 ? "Open 24 Hours" : "Open until 10:30 PM",
      reviews_highlight: `Leading customer choice for ${category} in ${city}.`,
      source_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comp.name)}`
    };
  }).sort((a, b) => a.distance_km - b.distance_km);

  const step = Math.max(50, Math.round((maxPrice - minPrice) / 4));
  const distribution = [
    { range: `₹${minPrice}–₹${minPrice + step}`, count: 4, share: 14 },
    { range: `₹${minPrice + step}–₹${minPrice + step * 2}`, count: 12, share: 38 },
    { range: `₹${minPrice + step * 2}–₹${minPrice + step * 3}`, count: 10, share: 32 },
    { range: `₹${minPrice + step * 3}–₹${maxPrice}`, count: 3, share: 10 },
    { range: `₹${maxPrice}+`, count: 2, share: 6 }
  ];

  const explicitScore = params.overall_score !== undefined
    ? Number(params.overall_score)
    : (params.scores && params.scores.overall_score !== undefined
      ? Number(params.scores.overall_score)
      : null);

  const explicitRec = params.recommendation || (params.scores && params.scores.recommendation) || (
    explicitScore !== null
      ? (explicitScore >= 75 ? 'ENTER' : explicitScore >= 50 ? 'INVESTIGATE' : 'AVOID')
      : 'ENTER'
  );

  const overallScore = explicitScore !== null
    ? explicitScore
    : (explicitRec === 'INVESTIGATE' ? 71 : explicitRec === 'AVOID' ? 46 : 82);

  const confidence = params.confidence || (explicitRec === 'INVESTIGATE' ? 80 : explicitRec === 'AVOID' ? 89 : 84);

  let compScore = 68;
  let compOpportunity = 70;
  let demandScore = 86;
  let pricingScore = 79;
  let marketGapScore = 91;
  let statusColor = 'emerald';
  let badgeIcon = 'check_circle';
  let summary = `Strong opportunity for ${category} in ${city} with favorable demand velocity and healthy pricing headroom.`;
  let trendDirection = '↗ Increasing';
  let trendHistory = [
    { month: 'May', index: 64 },
    { month: 'Jun', index: 70 },
    { month: 'Jul', index: 73 },
    { month: 'Aug', index: 79 },
    { month: 'Sep', index: 83 },
    { month: 'Oct', index: 87 }
  ];

  if (explicitRec === 'INVESTIGATE') {
    statusColor = 'amber';
    badgeIcon = 'warning';
    compScore = 74;
    compOpportunity = 62;
    demandScore = 76;
    pricingScore = 68;
    marketGapScore = 73;
    summary = `Viable opportunity for ${category} in ${city}, but incumbent competition and pricing dynamics require thorough validation before entering.`;
    trendDirection = '→ Stable / Moderate';
    trendHistory = [
      { month: 'May', index: 68 },
      { month: 'Jun', index: 70 },
      { month: 'Jul', index: 71 },
      { month: 'Aug', index: 73 },
      { month: 'Sep', index: 74 },
      { month: 'Oct', index: 76 }
    ];
  } else if (explicitRec === 'AVOID') {
    statusColor = 'rose';
    badgeIcon = 'cancel';
    compScore = 89;
    compOpportunity = 34;
    demandScore = 48;
    pricingScore = 52;
    marketGapScore = 42;
    summary = `Market heavily saturated with intense incumbent competition and compressed margins for ${category} in ${city}. High capital risk.`;
    trendDirection = '↘ Declining';
    trendHistory = [
      { month: 'May', index: 64 },
      { month: 'Jun', index: 60 },
      { month: 'Jul', index: 55 },
      { month: 'Aug', index: 51 },
      { month: 'Sep', index: 48 },
      { month: 'Oct', index: 46 }
    ];
  }

  return {
    id: params.id || 'analysis-' + Math.random().toString(36).substring(2, 9),
    created_at: params.created_at || new Date().toISOString().replace('T', ' ').substring(0, 19),
    category,
    location,
    sub_location: params.sub_location || subLocation,
    radius_km: radius,
    target_coordinates: [baseLat, baseLng],
    demographic: params.demographic || 'Target audience and local professionals',
    budget: params.budget || '₹5,00,000 - ₹15,00,000',
    goal: params.goal || 'Start a Brand-New Business',
    is_demo: true,
    scores: {
      overall_score: overallScore,
      recommendation: explicitRec,
      status_color: statusColor,
      badge_icon: badgeIcon,
      confidence: confidence,
      summary: summary,
      breakdown: {
        competition: {
          score: compScore,
          opportunity_factor: compOpportunity,
          explanation: explicitRec === 'INVESTIGATE'
            ? `Moderate-to-high competitor density across ${city}; incumbents hold established local market share.`
            : explicitRec === 'AVOID'
            ? `Severe saturation with aggressive incumbent presence and ongoing pricing battles.`
            : `Moderate competitor density across ${city}; existing providers show peak-hour saturation and service gaps.`
        },
        demand: {
          score: demandScore,
          explanation: explicitRec === 'INVESTIGATE'
            ? `Search query velocity is stable (+6% YoY) but lacks explosive breakout momentum in ${city}.`
            : explicitRec === 'AVOID'
            ? `Consumer inquiry velocity has declined over consecutive quarters in this localized catchment.`
            : `Search query velocity and footfall indicators for ${category} in ${city} show strong upward momentum (+14% YoY).`
        },
        pricing: {
          score: pricingScore,
          explanation: explicitRec === 'INVESTIGATE'
            ? `Tight margin headroom; retail pricing is constrained by established value competitors.`
            : explicitRec === 'AVOID'
            ? `Negative gross margin pressure driven by heavy discounting among incumbents.`
            : `Healthy gross margins exist between supply costs and current retail pricing brackets.`
        },
        market_gap: {
          score: marketGapScore,
          explanation: explicitRec === 'INVESTIGATE'
            ? `Selective niche whitespace exists, but mainstream customer slots are heavily occupied.`
            : explicitRec === 'AVOID'
            ? `Negligible whitespace; all prime operational hours and sub-categories are heavily served.`
            : `Clear whitespace in extended operating hours and specialized modern customer experience.`
        }
      },
      formula: {
        equation: 'Overall Opportunity = (0.30 × Demand) + (0.25 × Market Gap) + (0.25 × Pricing) + (0.20 × Competition Opportunity)',
        weights: {
          demand: 0.30,
          market_gap: 0.25,
          pricing: 0.25,
          competition_opportunity: 0.20
        },
        disclaimer: 'This score represents an algorithmic synthesis of live market signals from SerpApi (Maps, Shopping, Trends, and Search). It is an explainable decision-support model, not an absolute financial guarantee.'
      }
    },
    competitors,
    pricing: {
      status: 'Demo Mode',
      is_demo: true,
      count: 6,
      retrieved_at: 'Just now',
      avg_price: avgPrice,
      min_price: minPrice,
      max_price: maxPrice,
      recommended_entry_range: `₹${Math.round(avgPrice * 0.85)}–₹${Math.round(avgPrice * 1.05)}${priceUnit}`,
      distribution,
      insight: `Most competitors cluster between ₹${Math.round(avgPrice * 0.88)}–₹${Math.round(avgPrice * 1.15)}${priceUnit}, creating an opportunity to enter around ₹${Math.round(avgPrice * 0.92)}${priceUnit} while maintaining healthy margins.`
    },
    demand: {
      status: 'Demo Mode',
      is_demo: true,
      count: 4,
      retrieved_at: 'Just now',
      trend_direction: trendDirection,
      demand_score: demandScore,
      search_volume_index: explicitRec === 'INVESTIGATE' ? 'Moderate (Top 35% YoY)' : explicitRec === 'AVOID' ? 'Low / Saturated' : 'High (Top 14% YoY)',
      trend_history: trendHistory,
      related_searches: [
        `best ${category.toLowerCase()} near me`,
        `${category.toLowerCase()} in ${city}`,
        `top rated ${category.toLowerCase()} reviews`,
        `affordable ${category.toLowerCase()} prices`,
        `new ${category.toLowerCase()} opening ${city}`,
        `${category.toLowerCase()} membership and booking`
      ]
    },
    intelligence: {
      recommendation: explicitRec,
      why_reasons: explicitRec === 'INVESTIGATE' ? [
        `Demand is moderate: Search query index for ${category.toLowerCase()} in ${city} is stable (+6% YoY).`,
        `Competition is elevated: established bakeries and providers hold strong brand loyalty.`,
        `Pricing compression: gross margin headroom is tighter requiring lean procurement.`,
        `Clear differentiation on specialized craftsmanship or unique menu/service is essential to capture market share.`
      ] : explicitRec === 'AVOID' ? [
        `Oversaturated local market with high competitor density per sq km.`,
        `Heavy discounting and price wars compressing unit gross margins.`,
        `Customer acquisition costs in ${city} are excessively high relative to lifetime value.`,
        `Customer retention is volatile with low switching barriers.`
      ] : [
        `Demand is strong: Search query index for ${category.toLowerCase()} in ${city} is up 14% YoY.`,
        `Competition is moderate: existing players cluster around legacy models with peak-time bottlenecks.`,
        `There is a clear pricing gap offering healthy gross margin headroom.`,
        `Customers are underserved in evening operational hours and modern digital booking/service.`
      ],
      strategy: explicitRec === 'INVESTIGATE'
        ? `Proceed with caution in ${city}. Validate willingness-to-pay via pop-ups or small-batch pre-orders before committing capital expenditure.`
        : explicitRec === 'AVOID'
        ? `Avoid entering ${city} in this category under current macro conditions. Pivot towards secondary suburban catchments with lower density.`
        : `Target ${params.demographic || 'young professionals and local customers'} within a 3–5 km radius in ${city}. Position around dependable quality, clear pricing, and customer-first digital touchpoints.`,
      opportunities: [
        {
          id: 'opp-1',
          title: `Accessible Premium ${category}`,
          demand_level: explicitRec === 'INVESTIGATE' ? 'Moderate' : 'High',
          competition_level: explicitRec === 'INVESTIGATE' ? 'High' : 'Medium',
          demand_badge_color: 'emerald',
          comp_badge_color: 'amber',
          why_it_matters: `Established providers in ${city} charge high rates, creating customer demand for high quality without excessive markups.`,
          evidence: `Competitor reviews highlight price resistance and appetite for transparent subscription packages.`,
          potential_action: `Introduce an accessible core offering with flexible membership or loyalty perks.`
        },
        {
          id: 'opp-2',
          title: `Specialized & Modern ${category} Experience`,
          demand_level: 'Growing (+32%)',
          competition_level: 'Low',
          demand_badge_color: 'emerald',
          comp_badge_color: 'emerald',
          why_it_matters: `Consumers want specialized, tech-enabled ${category.toLowerCase()} options, but incumbents rely on dated formats.`,
          evidence: `Rising search queries for specialized ${category.toLowerCase()} terms show rapid double-digit growth.`,
          potential_action: `Build a modern brand identity with online reservations and premium customer support.`
        },
        {
          id: 'opp-3',
          title: `Extended Operational Hours & Convenience`,
          demand_level: 'Medium',
          competition_level: 'Low',
          demand_badge_color: 'blue',
          comp_badge_color: 'emerald',
          why_it_matters: `Over 75% of competitors close early, leaving off-peak demand completely unserved.`,
          evidence: `Google Maps hours confirm only 1 competitor offers late-evening or 24/7 service within 5km.`,
          potential_action: `Offer extended evening hours or on-demand booking to capture off-peak revenue.`
        }
      ],
      change_factors: [
        {
          trigger: 'New Chain Entry',
          impact: 'If major national chains open multiple outlets nearby, marketing costs may rise.',
          mitigation: 'Build strong local community loyalty and referral incentives.'
        },
        {
          trigger: 'Commercial Rent Increases',
          impact: `Rising rental rates in ${city} can impact net operating margins.`,
          mitigation: 'Focus on efficient space utilization and high sales density per sq ft.'
        },
        {
          trigger: 'Input Cost Inflation',
          impact: 'Sudden cost spikes in raw supplies or equipment can squeeze unit economics.',
          mitigation: 'Establish direct wholesale agreements and multi-supplier backups.'
        }
      ],
      sources_summary: [
        {
          name: 'Google Maps Local Pack',
          engine: 'google_maps',
          description: `Verified ${category.toLowerCase()} competitors, geo-coordinates, ratings, and operating hours`,
          status: 'Demo Mode',
          is_demo: true,
          count: 6,
          updated_at: 'Just now'
        },
        {
          name: 'Google Shopping Pricing Engine',
          engine: 'google_shopping',
          description: 'Commercial pricing brackets, equipment supplies, and margin elasticity',
          status: 'Demo Mode',
          is_demo: true,
          count: 6,
          updated_at: 'Just now'
        },
        {
          name: 'Google Trends & Search Volume',
          engine: 'google',
          description: 'Search momentum, query velocity, and seasonal peaks',
          status: 'Demo Mode',
          is_demo: true,
          count: 4,
          updated_at: 'Just now'
        },
        {
          name: 'Google Search Knowledge Graph',
          engine: 'google',
          description: 'Market research, forum mentions, and real estate benchmarks',
          status: 'Demo Mode',
          is_demo: true,
          count: 18,
          updated_at: 'Just now'
        }
      ]
    },
    meta: {
      engine_version: 'MarketPilot Agent-Orchestrator v4.19',
      serpapi_status: 'Demo Data (Not Live)',
      total_signals_analyzed: 44
    }
  };
}

export function getLocalFallbackHistory() {
  const seed1 = {
    id: 'analysis-seed-1',
    category: 'Specialty Coffee Shop',
    location: 'Bangalore, Karnataka, India',
    sub_location: 'Koramangala & Indiranagar',
    radius_km: 5.0,
    demographic: 'College students, remote software engineers & young professionals',
    budget: '₹5,00,000 - ₹15,00,000',
    goal: 'Start a Brand-New Business',
    date: '2026-10-04',
    overall_score: 82,
    recommendation: 'ENTER',
    confidence: 84,
    is_demo: true
  };
  const seed2 = {
    id: 'analysis-seed-2',
    category: 'Artisan Sourdough Bakery',
    location: 'Bandra West, Mumbai, India',
    sub_location: 'Pali Hill & Perry Road',
    radius_km: 3.0,
    demographic: 'Affluent health-conscious families and creatives',
    budget: '₹15,00,000+',
    goal: 'Expand an Existing Business',
    date: '2026-10-02',
    overall_score: 71,
    recommendation: 'INVESTIGATE',
    confidence: 80,
    is_demo: true
  };
  const seed3 = {
    id: 'analysis-seed-3',
    category: 'CrossFit & Functional Training Gym',
    location: 'Hauz Khas, New Delhi, India',
    sub_location: 'Green Park & SDA Market',
    radius_km: 4.5,
    demographic: 'High net-worth urbanites & corporate professionals',
    budget: '₹15,00,000+',
    goal: 'Find an Underserved Market Gap',
    date: '2026-09-28',
    overall_score: 46,
    recommendation: 'AVOID',
    confidence: 89,
    is_demo: true
  };

  seed1.full_data = getLocalFallbackAnalysis(seed1);
  seed2.full_data = getLocalFallbackAnalysis(seed2);
  seed3.full_data = getLocalFallbackAnalysis(seed3);

  return [seed1, seed2, seed3];
}
