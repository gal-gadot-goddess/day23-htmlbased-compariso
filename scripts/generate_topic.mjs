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
    { left: "#4f46e5", right: "#fbbf24" }  // Deep Indigo vs Cyber Yellow
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
        topLabel: "CONTAINER ORCHESTRATION",
        mainTitle: { left: "Kubernetes", right: "Docker Swarm", vs: "vs" },
        leftSub: "Enterprise Scale",
        rightSub: "Lightweight Simplicity",
        leftColor: "#326CE5",
        rightColor: "#2496ED",
        badge: "THE 7 CORE DIFFERENCES",
        differences: [
            {
                title: "1. ARCHITECTURE",
                leftTitle: "Distributed Cluster",
                rightTitle: "Built-in Engine",
                leftDesc: "Modular control plane with etcd, scheduler, kubelet, and controller manager.",
                rightDesc: "Directly embedded inside Docker Engine CLI with zero extra installation.",
                leftIcon: "Network",
                rightIcon: "Box",
                leftVisualText: "Modular Control",
                rightVisualText: "Native Daemon"
            },
            {
                title: "2. LEARNING CURVE",
                leftTitle: "Steep Mastery",
                rightTitle: "Instant Adoption",
                leftDesc: "Requires deep understanding of CRDs, pods, ingress, and manifests.",
                rightDesc: "Uses familiar docker-compose syntax and standard docker commands.",
                leftIcon: "Cpu",
                rightIcon: "Zap",
                leftVisualText: "High Complexity",
                rightVisualText: "Fast Setup"
            },
            {
                title: "3. AUTO-SCALING",
                leftTitle: "HPA & VPA Native",
                rightTitle: "Manual / Scripted",
                leftDesc: "Automatically scales pods and underlying cluster nodes dynamically under load.",
                rightDesc: "Scaling requires manual replica commands or third-party monitoring webhooks.",
                leftIcon: "Activity",
                rightIcon: "Settings",
                leftVisualText: "Autonomous",
                rightVisualText: "Manual Replicas"
            },
            {
                title: "4. ECOSYSTEM",
                leftTitle: "Industry Standard",
                rightTitle: "Niche Simplicity",
                leftDesc: "Massive CNCF community, Helm charts, operators, and cloud managed services.",
                rightDesc: "Smaller ecosystem, perfect for small internal tools or single-team setups.",
                leftIcon: "Globe",
                rightIcon: "Shield",
                leftVisualText: "Cloud Native",
                rightVisualText: "Single Engine"
            },
            {
                title: "5. HIGH AVAILABILITY",
                leftTitle: "Self-Healing Pods",
                rightTitle: "Basic Recovery",
                leftDesc: "Sophisticated health probes, automatic rescheduling, and rolling upgrades.",
                rightDesc: "Restarts crashed tasks across surviving nodes in the swarm overlay.",
                leftIcon: "Server",
                rightIcon: "HardDrive",
                leftVisualText: "Deep Healing",
                rightVisualText: "Task Restart"
            },
            {
                title: "6. NETWORKING",
                leftTitle: "CNI Plugins",
                rightTitle: "Overlay Mesh",
                leftDesc: "Rich networking choices: Cilium, Calico, Flannel, and service meshes.",
                rightDesc: "Built-in ingress routing mesh and multi-host overlay networks.",
                leftIcon: "Share2",
                rightIcon: "Lock",
                leftVisualText: "eBPF / CNI",
                rightVisualText: "Overlay Mesh"
            },
            {
                title: "7. RESOURCE OVERHEAD",
                leftTitle: "Heavy Footprint",
                rightTitle: "Ultra Lightweight",
                leftDesc: "Consumes significant RAM and CPU merely to run the control plane.",
                rightDesc: "Negligible memory overhead, running smoothly on modest VPS servers.",
                leftIcon: "Database",
                rightIcon: "Unlock",
                leftVisualText: "Resource Heavy",
                rightVisualText: "Minimal RAM"
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
    const recentHistoryStr = history.slice(-40).join(', ');
    const randomColors = getRandomColorPair();

    const prompt = `
Generate a valid JSON object for a technical comparison visual (Reel/Short format).
The comparison should be between two technologies, architectures, or concepts.
Topic MUST BE FRESH and COMPLETELY DIFFERENT from these previously covered topics:
${recentHistoryStr}

Pick from popular high-engagement areas:
- Modern Web/Frontend (e.g. Next.js App Router vs Pages Router, Bun vs Node.js, Svelte vs React, Tailwind vs CSS Modules, Zustand vs Redux Toolkit)
- Backend & Distributed Systems (e.g. gRPC vs REST, Kafka vs RabbitMQ, WebSockets vs Server-Sent Events, Redis vs Memcached)
- Cloud & DevOps (e.g. Terraform vs Pulumi, Serverless vs Dedicated Containers, AWS Lambda vs Cloudflare Workers)
- Databases & Data Engineering (e.g. ClickHouse vs Snowflake, DynamoDB vs MongoDB, OLAP vs OLTP)
- AI & Infrastructure (e.g. PyTorch vs JAX, Vector DB vs Relational Search)

Color Strategy:
Assign distinct, vibrant contrasting hex colors for leftColor and rightColor (e.g. "${randomColors.left}" and "${randomColors.right}" or other vibrant cyber neon colors like cyan, coral, emerald, indigo, amber, fuchsia, turquoise). NEVER use dull, washed-out or identical colors.

Return ONLY valid JSON. No markdown code blocks, no explanation, no backticks.

JSON Schema:
{
    "topLabel": "UPPERCASE CATEGORY (e.g. DISTRIBUTED SYSTEMS)",
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
            "leftDesc": "Concise high-impact explanation (10 to 18 words)",
            "rightDesc": "Concise high-impact explanation (10 to 18 words)",
            "leftIcon": "Choose from: Database, Cpu, Network, Lock, Unlock, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, ArrowRightLeft, FileCode, Search, Settings, HardDrive, Layout, Share2, Terminal",
            "rightIcon": "Choose from the same list",
            "leftVisualText": "Visual badge (1-2 words)",
            "rightVisualText": "Visual badge (1-2 words)"
        }
    ]
}

Rules:
1. Provide EXACTLY 7 differences.
2. High contrast against dark background.
3. Concise, punchy developer language.
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
            seed: Math.floor(Math.random() * 1000000)
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

async function main() {
    let topic = null;

    try {
        topic = await generateWithPollinations();
    } catch (err) {
        console.warn(`⚠️ AI generation error: ${err.message}. Selecting curated fallback...`);
        const history = getHistory();
        const available = curatedFallbacks.filter(f => {
            const name = `${f.mainTitle.left} vs ${f.mainTitle.right}`;
            return !history.includes(name);
        });
        const selectedFallback = (available.length > 0 ? available : curatedFallbacks)[Math.floor(Math.random() * curatedFallbacks.length)];
        topic = JSON.parse(JSON.stringify(selectedFallback));
        // Rotate colors dynamically even on fallback
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
