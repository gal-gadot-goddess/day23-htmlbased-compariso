import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.POLLINATIONS_API_KEY;
const DEFAULT_MODEL = process.env.AI_MODEL || 'gemini-fast';

const OUTPUT_FILE = path.join(__dirname, '../src/data/current_topic.json');
const HISTORY_FILE = path.join(__dirname, '../topic_history.json');

// Vibrant, contrasting color palettes for cinematic dark background
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

// Broad, rotating technical domains to maximize diversity in AI topic selection
const DOMAINS = [
    {
        category: "DATA LAKEHOUSES & TABLE FORMATS",
        guidance: "Compare two competing open table formats or data lake architectures (metadata specs, partitioning, concurrency, time-travel, catalog support)."
    },
    {
        category: "MODERN RUNTIMES & SYSTEMS LANGUAGES",
        guidance: "Compare two modern systems programming languages, package managers, or native runtimes (memory safety, concurrency, compile-time checks, developer ergonomics)."
    },
    {
        category: "EDGE RUNTIMES & WEB FRAMEWORKS",
        guidance: "Compare two edge-ready web micro-frameworks or serverless runtimes (routing speed, type safety, cold start latency, memory footprint)."
    },
    {
        category: "IN-MEMORY STORES & CACHES",
        guidance: "Compare two high-throughput in-memory data engines, key-value stores, or caches (threading model, eviction, snapshotting, memory efficiency)."
    },
    {
        category: "VECTOR DATABASES & AI SEARCH",
        guidance: "Compare two vector databases, embedding stores, or hybrid search engines (indexing algorithms, quantization, metadata filtering, clustering)."
    },
    {
        category: "SECURITY & AUTHENTICATION PROTOCOLS",
        guidance: "Compare two authentication mechanisms, token specifications, or identity protocols (cipher suites, downgrade protection, parsing security, federation)."
    },
    {
        category: "TYPESCRIPT ORMS & DATA ACCESS",
        guidance: "Compare two modern TypeScript database access libraries or ORMs (schema definitions, query execution, cold starts, SQL parity, migrations)."
    },
    {
        category: "WORKFLOW & DATA ORCHESTRATION",
        guidance: "Compare two workflow engines or orchestration platforms (durable execution vs DAG scheduling, replay mechanics, fault tolerance, latency)."
    },
    {
        category: "DESKTOP & CROSS-PLATFORM APPS",
        guidance: "Compare two cross-platform application frameworks or desktop webview technologies (binary size, memory usage, security sandboxing, native APIs)."
    },
    {
        category: "WEB SERVERS & REVERSE PROXIES",
        guidance: "Compare two modern edge reverse proxies or HTTP/3 web servers (TLS automation, config model, memory safety, concurrency performance)."
    },
    {
        category: "SEARCH ENGINES & INFORMATION RETRIEVAL",
        guidance: "Compare two modern full-text or lexical search engines (indexing latency, typo tolerance, memory footprint, cluster management)."
    },
    {
        category: "TIME-SERIES & REAL-TIME ANALYTICS",
        guidance: "Compare two time-series databases or real-time analytical engines (data compression, ingestion throughput, retention policies, SQL support)."
    },
    {
        category: "INFRASTRUCTURE AS CODE & CLOUD",
        guidance: "Compare two infrastructure-as-code or cloud provisioning platforms (declarative vs imperative, state management, drift detection, ecosystem)."
    },
    {
        category: "CONTAINERIZATION & MICROVMS",
        guidance: "Compare two container isolation or microVM virtualization technologies (boot time, hypervisor isolation, memory footprint, syscall boundary)."
    },
    {
        category: "DISTRIBUTED MESSAGING & STREAMING",
        guidance: "Compare two distributed event streaming brokers or message queues (storage layer, consumer group balancing, log retention, backpressure)."
    },
    {
        category: "CODE FORMATTERS & LINTERS",
        guidance: "Compare two modern code quality, formatting, or linting tools (AST parsing speed, rule configurability, language coverage, memory usage)."
    },
    {
        category: "GRAPH DATABASES & KNOWLEDGE GRAPHS",
        guidance: "Compare two native graph databases or knowledge graph systems (Cypher support, index-free adjacency, transactional ACID, in-memory execution)."
    },
    {
        category: "API & SERIALIZATION PROTOCOLS",
        guidance: "Compare two modern binary serialization formats or RPC protocols (schema evolution, zero-copy decode, payload compactness, language bindings)."
    }
];

const BACKUP_MODELS = [DEFAULT_MODEL, 'openai', 'mistral'];

function getRandomColorPair() {
    return COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)];
}

function normalizeTopicName(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getHistory() {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    try {
        const raw = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        if (!Array.isArray(raw)) return [];
        const seen = new Set();
        const unique = [];
        for (const item of raw) {
            const norm = normalizeTopicName(item);
            if (norm && !seen.has(norm)) {
                seen.add(norm);
                unique.push(item);
            }
        }
        return unique;
    } catch (e) {
        return [];
    }
}

function saveToHistory(topic) {
    const history = getHistory();
    const candNorm = normalizeTopicName(topic);

    const alreadyExists = history.some(t => {
        const n = normalizeTopicName(t);
        if (n === candNorm) return true;
        const parts = topic.split(/\s+vs\s+/i);
        if (parts.length === 2) {
            const rev = normalizeTopicName(`${parts[1]} vs ${parts[0]}`);
            if (n === rev) return true;
        }
        return false;
    });

    if (!alreadyExists) {
        history.push(topic);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
        console.log(`📝 Committed "${topic}" to topic_history.json (Total unique: ${history.length})`);
    } else {
        console.log(`ℹ️ Topic "${topic}" already recorded in topic_history.json.`);
    }
}

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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callPollinationsEndpoint(prompt, selectedModel, randomColors) {
    const bodyPayload = {
        messages: [
            { 
                role: "system", 
                content: "You are an elite principal engineer and tech creator generating educational comparisons for software developers. You must generate 100% original, novel, high-value technical comparisons." 
            },
            { role: "user", content: prompt }
        ],
        jsonMode: true,
        temperature: 0.95,
        seed: Math.floor(Math.random() * 10000000)
    };

    let response = null;

    // Strategy 1: If API key present, call gen.pollinations.ai
    if (API_KEY) {
        try {
            response = await fetchWithTimeout('https://gen.pollinations.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({ ...bodyPayload, model: selectedModel })
            }, 25000);
        } catch (err) {
            console.warn(`[AI] gen.pollinations.ai error: ${err.message}. Retrying via public endpoint...`);
        }
    }

    // Strategy 2: If no API key or gen endpoint failed, call text.pollinations.ai
    if (!response || !response.ok) {
        const fallbackModel = selectedModel === 'gemini-fast' ? 'openai' : selectedModel;
        response = await fetchWithTimeout('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...bodyPayload, model: fallbackModel })
        }, 25000);
    }

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || (typeof data === 'string' ? data : null);
    if (!content && typeof data === 'object') {
        if (data.mainTitle?.left && data.mainTitle?.right) {
            return data;
        }
    }

    if (!content) throw new Error("Empty AI response content");

    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const topic = JSON.parse(jsonStr.trim());

    if (!topic.mainTitle?.left || !topic.mainTitle?.right || !Array.isArray(topic.differences) || topic.differences.length < 5) {
        throw new Error("Parsed JSON structure does not match expected comparison schema");
    }

    if (!topic.leftColor || !topic.rightColor || topic.leftColor.toLowerCase() === topic.rightColor.toLowerCase()) {
        topic.leftColor = randomColors.left;
        topic.rightColor = randomColors.right;
    }

    return topic;
}

async function generateWithPollinations(history, chosenDomain, modelName, randomColors) {
    const historyListStr = history.map(t => `- ${t}`).join('\n');

    const prompt = `
Generate a valid JSON object for a technical comparison visual (Reel/Short format for developers).

DOMAIN: ${chosenDomain.category}
FOCUS: ${chosenDomain.guidance}

CRITICAL REQUIREMENT - ZERO DUPLICATES:
This topic MUST BE 100% BRAND NEW and CANNOT BE ANY OF THESE PREVIOUS TOPICS:
${historyListStr}

Color Strategy:
Assign distinct, vibrant contrasting hex colors: leftColor="${randomColors.left}" and rightColor="${randomColors.right}".

Return ONLY valid JSON. No markdown code blocks, no explanation, no backticks.

JSON Schema:
{
    "topLabel": "${chosenDomain.category}",
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
            "leftIcon": "Valid Lucide icon name matching the concept (e.g. Database, Cpu, Network, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, HardDrive, Terminal, GitBranch, Cloud, Lock, Workflow, Radio, Flame, Compass, Key, FastForward, CheckCircle, Smartphone)",
            "rightIcon": "Valid Lucide icon name matching the concept (e.g. Database, Cpu, Network, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, HardDrive, Terminal, GitBranch, Cloud, Lock, Workflow, Radio, Flame, Compass, Key, FastForward, CheckCircle, Smartphone)",
            "leftVisualText": "Visual badge (1-2 words)",
            "rightVisualText": "Visual badge (1-2 words)"
        }
    ]
}

Rules:
1. Provide EXACTLY 7 differences.
2. Explanations must be DEEP, ACCURATE, and HIGHLY INFORMATIVE for software engineers (20-35 words per side explaining concrete mechanisms).
3. Both technologies must be real, widely used, or emerging production tools.
4. DO NOT use generic or silly placeholder topics.
`;

    return await callPollinationsEndpoint(prompt, modelName, randomColors);
}

async function main() {
    let topic = null;
    const history = getHistory();
    const normalizedHistory = new Set();

    for (const h of history) {
        normalizedHistory.add(normalizeTopicName(h));
        const parts = h.split(/\s+vs\s+/i);
        if (parts.length === 2) {
            normalizedHistory.add(normalizeTopicName(`${parts[1]} vs ${parts[0]}`));
        }
    }

    console.log(`📚 Existing topic history contains ${history.length} unique topics.`);

    // Shuffle domains to ensure fresh category selection on each run
    const shuffledDomains = [...DOMAINS].sort(() => 0.5 - Math.random());

    const MAX_ATTEMPTS = 8;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const domain = shuffledDomains[(attempt - 1) % shuffledDomains.length];
        const model = BACKUP_MODELS[(attempt - 1) % BACKUP_MODELS.length];
        const randomColors = getRandomColorPair();

        console.log(`\n🚀 Attempt ${attempt}/${MAX_ATTEMPTS}: Requesting AI topic in "${domain.category}" (Model: ${model})...`);

        try {
            const candidate = await generateWithPollinations(history, domain, model, randomColors);
            const candName = `${candidate.mainTitle.left} vs ${candidate.mainTitle.right}`;
            const candNorm = normalizeTopicName(candName);
            const candRevNorm = normalizeTopicName(`${candidate.mainTitle.right} vs ${candidate.mainTitle.left}`);

            if (!normalizedHistory.has(candNorm) && !normalizedHistory.has(candRevNorm)) {
                topic = candidate;
                console.log(`✨ Success! Fresh AI topic generated: "${candName}"`);
                break;
            } else {
                console.warn(`⚠️ Attempt ${attempt}: Topic "${candName}" was already covered in history. Retrying with a different domain...`);
                // Append this rejected topic dynamically to history exclusion so next attempts don't repeat it
                history.push(candName);
                await sleep(3000);
            }
        } catch (err) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
            if (err.message.includes('402') || err.message.includes('FREE_LIMIT') || err.message.includes('429')) {
                console.log('⏳ Rate-limit hit. Waiting 5s before next attempt...');
                await sleep(5000);
            } else {
                await sleep(2000);
            }
        }
    }

    // STRICT: ZERO HARDCODED FALLBACKS.
    // If AI generation could not produce a unique topic after all attempts, halt with an error.
    if (!topic) {
        console.error("\n❌ FATAL: AI topic generation failed after all attempts. No hardcoded fallback will be used.");
        console.error("Halting cycle to prevent publishing duplicate or hardcoded content.");
        process.exit(1);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topic, null, 2));
    const finalTopicName = `${topic.mainTitle.left} vs ${topic.mainTitle.right}`;
    saveToHistory(finalTopicName);

    console.log(`\n✅ Successfully generated and saved: ${finalTopicName}`);
    console.log(`🎨 Colors: ${topic.leftColor} vs ${topic.rightColor}`);
    process.exit(0);
}

main();
