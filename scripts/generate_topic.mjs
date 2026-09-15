import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.POLLINATIONS_API_KEY;
const MODEL = process.env.AI_MODEL || 'gemini-fast';

const OUTPUT_FILE = path.join(__dirname, '../src/data/current_topic.json');
const HISTORY_FILE = path.join(__dirname, '../topic_history.json');

// Vibrant, contrasting color palettes that look cinematic on dark background
const COLOR_PAIRS = [
    { left: "#00d2ff", right: "#ff5c00" }, // Electric Cyan vs Neon Tangerine
    { left: "#6366f1", right: "#10b981" }, // Indigo Violet vs Emerald Green
    { left: "#f43f5e", right: "#38bdf8" }, // Hot Coral vs Sky Blue
    { left: "#a855f7", right: "#eab308" }, // Purple Neon vs Amber Gold
    { left: "#ec4899", right: "#06b6d4" }, // Pink Flamingo vs Bright Cyan
    { left: "#3b82f6", right: "#f97316" }, // Royal Blue vs Bright Orange
    { left: "#14b8a6", right: "#d946ef" }, // Teal vs Fuchsia
    { left: "#84cc16", right: "#8b5cf6" }, // Lime Green vs Electric Purple
    { left: "#22c55e", right: "#ef4444" }, // Vibrant Green vs Crimson Red
    { left: "#0ea5e9", right: "#f59e0b" }, // Ocean Blue vs Warm Amber
    { left: "#e11d48", right: "#2dd4bf" }, // Rose vs Mint
    { left: "#4f46e5", right: "#fbbf24" }, // Deep Indigo vs Cyber Yellow
    { left: "#06b6d4", right: "#f43f5e" }, // Cyan vs Rose
    { left: "#10b981", right: "#a855f7" }, // Emerald vs Violet
    { left: "#f59e0b", right: "#3b82f6" }, // Amber vs Sapphire
    { left: "#d946ef", right: "#22c55e" }, // Magenta vs Mint Green
    { left: "#38bdf8", right: "#fb7185" }, // Ice Blue vs Light Coral
    { left: "#8b5cf6", right: "#34d399" }, // Iris Purple vs Spring Emerald
    { left: "#f97316", right: "#0284c7" }, // Sunset Orange vs Sky Blue
    { left: "#eab308", right: "#6366f1" }  // Electric Gold vs Modern Indigo
];

function getRandomColorPair() {
    return COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)];
}

function getHistory() {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveToHistory(topic) {
    const history = getHistory();
    history.push(topic);
    // Keep last 150 entries to prevent repetitive topics
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-150), null, 2));
}

const curatedFallbacks = [
    {
        topLabel: "BACKEND ARCHITECTURE",
        mainTitle: { left: "GraphQL", right: "REST API", vs: "vs" },
        leftSub: "Flexible Queries",
        rightSub: "Standard Endpoints",
        leftColor: "#E535AB",
        rightColor: "#009688",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. DATA FETCHING",
                leftTitle: "Single Request",
                rightTitle: "Multiple Endpoints",
                leftDesc: "Client asks for exact data needed in one single HTTP request.",
                rightDesc: "Requires multiple roundtrips to different endpoints for related resources.",
                leftIcon: "Zap",
                rightIcon: "Layers",
                leftVisualText: "Precise Query",
                rightVisualText: "Endpoint Chaining"
            },
            {
                title: "2. OVERFETCHING",
                leftTitle: "Zero Overfetching",
                rightTitle: "Fixed Payloads",
                leftDesc: "Never downloads unwanted attributes or nested fields.",
                rightDesc: "Server determines payload size, frequently transferring unnecessary data.",
                leftIcon: "Activity",
                rightIcon: "HardDrive",
                leftVisualText: "Exact Payload",
                rightVisualText: "Heavy Payload"
            },
            {
                title: "3. SCHEMA & TYPING",
                leftTitle: "Strict Schema",
                rightTitle: "Loose Contracts",
                leftDesc: "Strongly typed schema guarantees contract safety between frontend and backend.",
                rightDesc: "Relies on OpenAPI or manual docs without runtime type enforcement.",
                leftIcon: "Code",
                rightIcon: "FileCode",
                leftVisualText: "Strict Types",
                rightVisualText: "Manual Specs"
            },
            {
                title: "4. CACHING",
                leftTitle: "Client-Side Cache",
                rightTitle: "Native HTTP Caching",
                leftDesc: "Complex POST queries bypass standard HTTP/CDN edge caching layers.",
                rightDesc: "Leverages standard HTTP status codes, ETags, and edge CDN caches natively.",
                leftIcon: "Cpu",
                rightIcon: "Globe",
                leftVisualText: "Complex Cache",
                rightVisualText: "Edge Friendly"
            },
            {
                title: "5. VERSIONING",
                leftTitle: "Continuous Evolution",
                rightTitle: "URI Versioning",
                leftDesc: "Deprecate fields at granular level without creating breaking API revisions.",
                rightDesc: "Requires major version routing like /v1, /v2 for breaking structural updates.",
                leftIcon: "ArrowRightLeft",
                rightIcon: "Terminal",
                leftVisualText: "Field Deprecation",
                rightVisualText: "v1 / v2 Break"
            },
            {
                title: "6. REALTIME UPDATES",
                leftTitle: "Built-in Subscriptions",
                rightTitle: "WebSockets Addon",
                leftDesc: "Native WebSocket subscriptions stream live events out of the box.",
                rightDesc: "Requires auxiliary protocols like WebSockets or SSE architecture.",
                leftIcon: "Network",
                rightIcon: "Server",
                leftVisualText: "Live Stream",
                rightVisualText: "External Socket"
            },
            {
                title: "7. COMPLEXITY",
                leftTitle: "Higher Overhead",
                rightTitle: "Simple & Universal",
                leftDesc: "Requires query parser, resolver optimization, and N+1 query protection.",
                rightDesc: "Straightforward controllers, universally understood across all tech stacks.",
                leftIcon: "Shield",
                rightIcon: "Box",
                leftVisualText: "Query Resolvers",
                rightVisualText: "Standard Routes"
            }
        ]
    },
    {
        topLabel: "ANALYTICS & EMBEDDED ENGINES",
        mainTitle: { left: "DuckDB", right: "SQLite", vs: "vs" },
        leftSub: "Columnar OLAP",
        rightSub: "Row-based OLTP",
        leftColor: "#FFF000",
        rightColor: "#003B57",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. STORAGE MODEL",
                leftTitle: "Columnar Vectorized",
                rightTitle: "B-Tree Row Storage",
                leftDesc: "Stores values by column in contiguous memory chunks, executing SIMD vectorized scans across millions of rows per millisecond.",
                rightDesc: "Stores full rows contiguously inside standard B-Tree pages, optimal for single-record key lookups.",
                leftIcon: "Layers",
                rightIcon: "Database",
                leftVisualText: "Column Vector",
                rightVisualText: "B-Tree Pages"
            },
            {
                title: "2. TARGET WORKLOAD",
                leftTitle: "Heavy Aggregations",
                rightTitle: "Transactional CRUD",
                leftDesc: "Built specifically for analytical queries like GROUP BY, window functions, and complex joins over gigabytes of Parquet.",
                rightDesc: "Designed for high-throughput single-row transactional writes, reads, and primary key point operations.",
                leftIcon: "Activity",
                rightIcon: "Zap",
                leftVisualText: "Deep Analytics",
                rightVisualText: "Fast Point CRUD"
            },
            {
                title: "3. PARQUET & ARROW",
                leftTitle: "Native Zero-Copy",
                rightTitle: "Requires Plugins",
                leftDesc: "Queries remote Parquet, JSON, and Apache Arrow streams directly without loading data into an internal database file.",
                rightDesc: "Requires virtual table extensions and data loading scripts to parse and index external analytical formats.",
                leftIcon: "HardDrive",
                rightIcon: "FileCode",
                leftVisualText: "Zero-Copy Parquet",
                rightVisualText: "File Import"
            },
            {
                title: "4. MULTI-THREADING",
                leftTitle: "Parallel Execution",
                rightTitle: "Single Writer Lock",
                leftDesc: "Saturates all CPU cores automatically with a morsel-driven parallel query engine for batch workloads.",
                rightDesc: "Serializes concurrent writes using WAL locks, limiting concurrent execution throughput on heavy calculations.",
                leftIcon: "Cpu",
                rightIcon: "Lock",
                leftVisualText: "Multi-Core SIMD",
                rightVisualText: "Serial Locks"
            },
            {
                title: "5. MEMORY CONSUMPTION",
                leftTitle: "Buffer-Pool Spilling",
                rightTitle: "Tiny Minimal Footprint",
                leftDesc: "Allocates large RAM buffer pools and spills intermediate group states to temporary disk when memory limits are reached.",
                rightDesc: "Runs smoothly inside embedded IoT devices, mobile apps, and smart watches with minimal megabytes of memory.",
                leftIcon: "Server",
                rightIcon: "Smartphone",
                leftVisualText: "Heavy Buffer",
                rightVisualText: "Ultra Compact"
            },
            {
                title: "6. QUERY OPTIMIZER",
                leftTitle: "Cost & Rule Based",
                rightTitle: "Heuristic Planner",
                leftDesc: "Advanced vectorized optimizer calculates join order reordering, filter pushdown, and dynamic runtime statistics.",
                rightDesc: "Lean query planner prioritizing predictable, deterministic execution plans and zero runtime overhead.",
                leftIcon: "Workflow",
                rightIcon: "Compass",
                leftVisualText: "Vector Optimizer",
                rightVisualText: "Lean Planner"
            },
            {
                title: "7. PRIMARY USE-CASE",
                leftTitle: "Data Science & BI",
                rightTitle: "Application State",
                leftDesc: "Ideal for Python Pandas replacements, dashboard aggregation engines, and local data warehouse experiments.",
                rightDesc: "The undisputed gold standard for edge devices, browser caches, desktop apps, and microservice databases.",
                leftIcon: "BarChart",
                rightIcon: "Box",
                leftVisualText: "Data Science",
                rightVisualText: "App Storage"
            }
        ]
    },
    {
        topLabel: "CLIENT STATE MANAGEMENT",
        mainTitle: { left: "Zustand", right: "Redux Toolkit", vs: "vs" },
        leftSub: "Minimal Hooks",
        rightSub: "Standardized Slices",
        leftColor: "#443E38",
        rightColor: "#764ABC",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. BOILERPLATE",
                leftTitle: "Zero Boilerplate",
                rightTitle: "Structured Slices",
                leftDesc: "Create a reactive global store in 4 lines of code without reducers, dispatchers, or context providers.",
                rightDesc: "Requires createSlice, configureStore, action definitions, and root reducer composition.",
                leftIcon: "Zap",
                rightIcon: "Layers",
                leftVisualText: "Instant Store",
                rightVisualText: "Slice Setup"
            },
            {
                title: "2. REACT PROVIDER",
                leftTitle: "No Context Wrapper",
                rightTitle: "Mandatory Provider",
                leftDesc: "Consumes state outside of the React render tree with direct store subscriptions and zero provider wrapping.",
                rightDesc: "Every consuming component must sit inside the centralized Redux Provider context tree.",
                leftIcon: "Code",
                rightIcon: "Box",
                leftVisualText: "Provider-Free",
                rightVisualText: "Provider Tree"
            },
            {
                title: "3. BUNDLE SIZE",
                leftTitle: "~1.1 kB Gzipped",
                rightTitle: "~11 kB Gzipped",
                leftDesc: "Ultra-lean micro library built on React 18 useSyncExternalStore with negligible bundle weight.",
                rightDesc: "Includes Immer, Redux-Thunk, Reselect, and action creators as part of standard distribution.",
                leftIcon: "Activity",
                rightIcon: "HardDrive",
                leftVisualText: "Micro Core",
                rightVisualText: "Full Suite"
            },
            {
                title: "4. ASYNC FLOWS",
                leftTitle: "Plain Async/Await",
                rightTitle: "createAsyncThunk",
                leftDesc: "Update state asynchronously with plain modern JavaScript async/await functions directly inside actions.",
                rightDesc: "Uses createAsyncThunk lifecycle actions (pending, fulfilled, rejected) or RTK Query endpoints.",
                leftIcon: "FastForward",
                rightIcon: "Workflow",
                leftVisualText: "Pure Async",
                rightVisualText: "Thunk Flow"
            },
            {
                title: "5. DEVTOOLS & LOGGING",
                leftTitle: "Middleware Plugin",
                rightTitle: "Deep Native Integration",
                leftDesc: "Redux DevTools support requires wrapping state creator in optional devtools middleware.",
                rightDesc: "Comprehensive time-travel debugging, action inspection, and diffing out of the box.",
                leftIcon: "Terminal",
                rightIcon: "Cpu",
                leftVisualText: "Optional DevTools",
                rightVisualText: "Native Time Travel"
            },
            {
                title: "6. RE-RENDER OPTIMIZATION",
                leftTitle: "Selector Scoping",
                rightTitle: "Reselect Memoization",
                leftDesc: "Components only re-render when their explicitly selected atomic state slice changes.",
                rightDesc: "Uses createSelector with multi-input memoization for complex derived state calculations.",
                leftIcon: "Shield",
                rightIcon: "Radio",
                leftVisualText: "Atomic Pick",
                rightVisualText: "Memoized Selectors"
            },
            {
                title: "7. BEST FIT",
                leftTitle: "Fast Agile Apps",
                rightTitle: "Large Enterprise",
                leftDesc: "Perfect for fast-paced modern startups, dashboard components, and interactive single page apps.",
                rightDesc: "Ideal for massive enterprise apps with hundreds of developers needing enforced uniform architecture.",
                leftIcon: "Globe",
                rightIcon: "Server",
                leftVisualText: "Lean & Fast",
                rightVisualText: "Strict Enterprise"
            }
        ]
    }
];

async function fetchWithTimeout(url, options, timeoutMs = 25000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        return response;
    } catch (err) {
        clearTimeout(timer);
        throw err;
    }
}

async function generateWithPollinations() {
    const history = getHistory();
    const recentHistoryStr = history.slice(-50).join(', ');
    const randomColors = getRandomColorPair();

    const prompt = `
Generate a valid JSON object for a technical comparison visual (Reel/Short format).
The comparison should be between two technologies, architectures, or concepts.
Topic MUST BE COMPLETELY NEW and CANNOT BE ANY OF THESE PREVIOUS TOPICS:
${recentHistoryStr}

Pick an exciting comparison from one of these domains:
- Databases & Storage Engines (e.g. SQLite vs DuckDB, ScyllaDB vs Cassandra, Pinecone vs Qdrant, RocksDB vs LevelDB)
- Modern Systems & Runtimes (e.g. Zig vs Rust, Go vs Rust, WebAssembly vs Native Containers, Deno vs Bun)
- Distributed Systems & Messaging (e.g. Apache Pulsar vs Kafka, NATS vs RabbitMQ, Raft vs Paxos)
- Web & Networking (e.g. HTTP/2 vs HTTP/3, WebRTC vs WebSockets, QUIC vs TCP, tRPC vs GraphQL)
- Security & Cloud (e.g. OAuth 2.0 vs OIDC, WireGuard vs OpenVPN, Cilium vs Calico, eBPF vs Kernel Modules)

Color Strategy:
Assign distinct, vibrant contrasting hex colors for leftColor and rightColor (e.g. "${randomColors.left}" and "${randomColors.right}"). NEVER use dull, washed-out or identical colors.

Return ONLY valid JSON. No markdown code blocks, no explanation, no backticks.

JSON Schema:
{
    "topLabel": "UPPERCASE CATEGORY",
    "mainTitle": {
        "left": "TECH 1",
        "right": "TECH 2",
        "vs": "vs"
    },
    "leftSub": "Max 3 words tagline",
    "rightSub": "Max 3 words tagline",
    "leftColor": "${randomColors.left}",
    "rightColor": "${randomColors.right}",
    "badge": "THE 7 CORE DIFFERENCES",
    "differences": [
        {
            "title": "1. KEY AREA",
            "leftTitle": "Point for Tech 1 (max 3 words)",
            "rightTitle": "Point for Tech 2 (max 3 words)",
            "leftDesc": "High-value educational explanation of how it works under the hood (20 to 35 words).",
            "rightDesc": "High-value educational explanation of how it works under the hood (20 to 35 words).",
            "leftIcon": "Valid Lucide icon name matching the concept (e.g. Database, Cpu, Network, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, HardDrive, Terminal, GitBranch, Cloud, Lock, Workflow, Radio, Flame, Compass, Key, FastForward, CheckCircle, Smartphone, etc.)",
            "rightIcon": "Valid Lucide icon name matching the concept (e.g. Database, Cpu, Network, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, HardDrive, Terminal, GitBranch, Cloud, Lock, Workflow, Radio, Flame, Compass, Key, FastForward, CheckCircle, Smartphone, etc.)",
            "leftVisualText": "Visual badge (1-2 words)",
            "rightVisualText": "Visual badge (1-2 words)"
        }
    ]
}

Rules:
1. Provide EXACTLY 7 differences.
2. Explanations must be DEEP, ACCURATE, and HIGHLY INFORMATIVE for developers (20-35 words per side explaining concrete mechanisms).
3. High contrast against dark background.
4. Engaging, viral tech-educator tone.
`;

    console.log(`🚀 Requesting new topic from Pollinations (${MODEL})...`);
    const headers = { 'Content-Type': 'application/json' };
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

    const res = await fetchWithTimeout('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: "You are an elite principal engineer and tech creator generating educational comparisons." },
                { role: "user", content: prompt }
            ],
            jsonMode: true,
            seed: Math.floor(Math.random() * 10000000)
        })
    }, 25000);

    if (!res.ok) {
        throw new Error(`Pollinations API HTTP ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    let content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response content");

    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const topic = JSON.parse(jsonStr.trim());

    if (!topic.mainTitle?.left || !topic.mainTitle?.right || !Array.isArray(topic.differences) || topic.differences.length < 5) {
        throw new Error("Parsed JSON structure does not match expected comparison schema");
    }

    // Ensure distinct vibrant colors if AI returned none or identical colors
    if (!topic.leftColor || !topic.rightColor || topic.leftColor.toLowerCase() === topic.rightColor.toLowerCase()) {
        topic.leftColor = randomColors.left;
        topic.rightColor = randomColors.right;
    }

    return topic;
}

function normalizeTopicName(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
    let topic = null;
    const history = getHistory();
    const normalizedHistory = new Set(history.map(normalizeTopicName));

    // Try up to 4 attempts to generate a truly unique topic via AI
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            const candidate = await generateWithPollinations();
            const candName = `${candidate.mainTitle.left} vs ${candidate.mainTitle.right}`;
            const candNorm = normalizeTopicName(candName);
            const candRevNorm = normalizeTopicName(`${candidate.mainTitle.right} vs ${candidate.mainTitle.left}`);

            if (!normalizedHistory.has(candNorm) && !normalizedHistory.has(candRevNorm)) {
                topic = candidate;
                console.log(`✨ Fresh topic generated on attempt ${attempt}: ${candName}`);
                break;
            } else {
                console.warn(`⚠️ Attempt ${attempt}: Topic "${candName}" was previously covered. Regenerating...`);
            }
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
        }
    }

    // Fallback if AI repeated or failed
    if (!topic) {
        console.warn("⚠️ AI attempts exhausted or duplicated. Selecting curated fallback...");
        const available = curatedFallbacks.filter(f => {
            const name = `${f.mainTitle.left} vs ${f.mainTitle.right}`;
            return !normalizedHistory.has(normalizeTopicName(name));
        });
        const selectedFallback = (available.length > 0 ? available : curatedFallbacks)[Math.floor(Math.random() * (available.length > 0 ? available.length : curatedFallbacks.length))];
        topic = JSON.parse(JSON.stringify(selectedFallback));
        const randomColors = getRandomColorPair();
        topic.leftColor = randomColors.left;
        topic.rightColor = randomColors.right;
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topic, null, 2));
    const topicName = `${topic.mainTitle.left} vs ${topic.mainTitle.right}`;
    saveToHistory(topicName);

    console.log(`✅ Successfully generated and saved: ${topicName} (Colors: ${topic.leftColor} vs ${topic.rightColor})`);
    process.exit(0);
}

main();
