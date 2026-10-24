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

// 30+ Diverse, rotating technical domains to maximize topic variety
const DOMAINS = [
    {
        category: "MODERN WEB FRAMEWORKS",
        guidance: "Compare two high-performance backend web frameworks (e.g. FastAPI vs Axum, NestJS vs Fastify, Hono vs Elysia, Go Fiber vs Gin, Actix-web vs Axum, Phoenix vs Ruby on Rails)."
    },
    {
        category: "DISTRIBUTED DATABASES & OLAP",
        guidance: "Compare two modern distributed database engines or OLAP data warehouses (e.g. ClickHouse vs StarRocks, CockroachDB vs YugabyteDB, TiDB vs OceanBase, ScyllaDB vs Cassandra)."
    },
    {
        category: "IN-MEMORY STORES & CACHES",
        guidance: "Compare two high-throughput in-memory data engines, key-value stores, or caches (e.g. Dragonfly vs Redis, Valkey vs Redis, Memcached vs Redis, Aerospike vs Redis)."
    },
    {
        category: "VECTOR DATABASES & AI SEARCH",
        guidance: "Compare two vector databases, embedding stores, or hybrid search engines (e.g. Milvus vs Weaviate, Qdrant vs Chroma, Pinecone vs Marqo, Vespa vs Milvus)."
    },
    {
        category: "AI & LLM INFERENCE ENGINES",
        guidance: "Compare two production LLM serving or inference engines (e.g. vLLM vs Ollama, TensorRT-LLM vs TGI, ONNX Runtime vs TorchScript, llama.cpp vs vLLM)."
    },
    {
        category: "OBSERVABILITY & MONITORING",
        guidance: "Compare two observability, metrics, or telemetry engines (e.g. Prometheus vs VictoriaMetrics, OpenTelemetry vs Jaeger, Grafana Loki vs Elasticsearch, Signoz vs Datadog)."
    },
    {
        category: "SECURITY & AUTHENTICATION",
        guidance: "Compare two authentication mechanisms, token specifications, or identity protocols (e.g. PASETO vs JWT, WebAuthn vs Passwords, OAuth 2.0 vs SAML, mTLS vs WireGuard)."
    },
    {
        category: "TYPESCRIPT ORMS & DATA ACCESS",
        guidance: "Compare two modern TypeScript database access libraries or ORMs (e.g. Prisma vs Drizzle ORM, Kysely vs TypeORM, MikroORM vs Prisma, EdgeDB vs Prisma)."
    },
    {
        category: "WORKFLOW & DATA ORCHESTRATION",
        guidance: "Compare two workflow engines or orchestration platforms (e.g. Temporal vs Apache Airflow, Prefect vs Dagster, Cadence vs Temporal, Camunda vs Temporal)."
    },
    {
        category: "DESKTOP & CROSS-PLATFORM APPS",
        guidance: "Compare two cross-platform application frameworks or desktop webview technologies (e.g. Tauri vs Electron, Flutter vs React Native, Wails vs Tauri, Neutralinojs vs Electron)."
    },
    {
        category: "WEB SERVERS & REVERSE PROXIES",
        guidance: "Compare two modern edge reverse proxies or HTTP/3 web servers (e.g. Caddy vs NGINX, Traefik vs Envoy, HAProxy vs NGINX, Pingora vs NGINX)."
    },
    {
        category: "SEARCH ENGINES & RETRIEVAL",
        guidance: "Compare two modern full-text or lexical search engines (e.g. Meilisearch vs Typesense, Elasticsearch vs OpenSearch, Algolia vs Typesense, Bleve vs Lucene)."
    },
    {
        category: "TIME-SERIES DATABASES",
        guidance: "Compare two time-series databases or real-time event log engines (e.g. TimescaleDB vs InfluxDB, QuestDB vs TimescaleDB, ClickHouse vs TimescaleDB, TDengine vs InfluxDB)."
    },
    {
        category: "INFRASTRUCTURE AS CODE & CLOUD",
        guidance: "Compare two infrastructure-as-code or cloud provisioning platforms (e.g. OpenTofu vs Terraform, Pulumi vs AWS CDK, Ansible vs Terraform, Nomad vs Kubernetes)."
    },
    {
        category: "CONTAINERIZATION & MICROVMS",
        guidance: "Compare two container isolation or microVM virtualization technologies (e.g. Firecracker vs gVisor, Podman vs Docker, containerd vs CRI-O, Kata Containers vs Firecracker)."
    },
    {
        category: "DISTRIBUTED MESSAGING & STREAMING",
        guidance: "Compare two distributed event streaming brokers or message queues (e.g. Redpanda vs Kafka, NATS JetStream vs RabbitMQ, Apache Pulsar vs Kafka, ZeroMQ vs Nanomsg)."
    },
    {
        category: "BUILD TOOLS & COMPILERS",
        guidance: "Compare two modern build tools, bundlers, or toolchains (e.g. Turbopack vs Vite, Rspack vs Webpack, esbuild vs SWC, Bun vs Turbopack)."
    },
    {
        category: "CODE FORMATTERS & LINTERS",
        guidance: "Compare two modern code quality, formatting, or linting tools (e.g. Biome vs Prettier, Ruff vs Flake8, ESLint vs Biome, Clippy vs Rustfmt)."
    },
    {
        category: "GRAPH DATABASES & KNOWLEDGE GRAPHS",
        guidance: "Compare two native graph databases or knowledge graph systems (e.g. Neo4j vs Memgraph, Amazon Neptune vs Neo4j, Dgraph vs ArangoDB, NebulaGraph vs Neo4j)."
    },
    {
        category: "API & SERIALIZATION PROTOCOLS",
        guidance: "Compare two modern binary serialization formats or RPC protocols (e.g. gRPC vs ConnectRPC, Cap'n Proto vs FlatBuffers, Apache Thrift vs gRPC, Avro vs Protocol Buffers)."
    },
    {
        category: "TESTING FRAMEWORKS & AUTOMATION",
        guidance: "Compare two modern testing frameworks or test runners (e.g. Vitest vs Jest, Playwright vs Cypress, K6 vs Locust, Pytest vs Unittest)."
    },
    {
        category: "EVENT-DRIVEN ARCHITECTURES",
        guidance: "Compare two event-driven messaging patterns or tools (e.g. Event Sourcing vs CDC, Debezium vs Kafka Connect, SQS vs Google Cloud Pub/Sub, Kafka Streams vs Apache Flink)."
    },
    {
        category: "FRONTEND REACTIVITY & RENDERING",
        guidance: "Compare two frontend reactivity paradigms or rendering concepts (e.g. Signals vs React Hooks, Resumability vs Hydration, Server Actions vs TRPC, Islands Architecture vs SPA)."
    },
    {
        category: "LOCAL-FIRST & CLIENT SYNC",
        guidance: "Compare two local-first or real-time data sync technologies (e.g. ElectricSQL vs Replicache, PowerSync vs ElectricSQL, RxDB vs WatermelonDB, Yjs vs Automerge)."
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
            // Skip any corrupted placeholder entries in history
            if (norm && !/tech1vstech2/i.test(norm) && !seen.has(norm)) {
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

    // Reject placeholders from ever entering history
    if (/tech1vstech2/i.test(candNorm) || !topic.includes(' vs ')) {
        console.warn(`⚠️ Refusing to save invalid topic "${topic}" to history.`);
        return;
    }

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

// Validates topic structure AND ensures no placeholder text like "TECH 1" or "Tool A"
function validateAndCleanTopic(topic, randomColors) {
    if (!topic || typeof topic !== 'object') throw new Error("AI returned non-object");
    if (!topic.mainTitle || typeof topic.mainTitle !== 'object') throw new Error("Missing mainTitle in AI response");

    let left = String(topic.mainTitle.left || '').trim();
    let right = String(topic.mainTitle.right || '').trim();

    // Regex matching any generic placeholder words
    const placeholderPattern = /^(tech|technology|tool|framework|service|system|concept|item|product|library|database|runtime|name|realname|topic)\s*([0-9]|one|two|[a-d])?$/i;

    // Check if AI literally output placeholder strings
    if (placeholderPattern.test(left.replace(/[^a-z0-9]/gi, '')) || placeholderPattern.test(right.replace(/[^a-z0-9]/gi, ''))) {
        // Attempt recovery: check if real names are in leftSub / rightSub or difference 1
        const leftSub = String(topic.leftSub || '').trim();
        const rightSub = String(topic.rightSub || '').trim();
        const firstDiffLeft = String(topic.differences?.[0]?.leftTitle || '').trim();
        const firstDiffRight = String(topic.differences?.[0]?.rightTitle || '').trim();

        // If leftSub or differences contain real names, extract them
        const extractFirstWord = (s) => s.split(/[\s,:-]+/)[0];
        const candLeft = extractFirstWord(leftSub) || extractFirstWord(firstDiffLeft);
        const candRight = extractFirstWord(rightSub) || extractFirstWord(firstDiffRight);

        if (candLeft && candRight && candLeft.toLowerCase() !== candRight.toLowerCase() && !placeholderPattern.test(candLeft) && !placeholderPattern.test(candRight)) {
            console.log(`🔄 Recovered technology names from payload: "${candLeft}" vs "${candRight}"`);
            left = candLeft;
            right = candRight;
        } else {
            throw new Error(`Rejected placeholder names: "${left}" vs "${right}"`);
        }
    }

    if (!left || !right) throw new Error("Missing left or right technology name");
    if (left.toLowerCase() === right.toLowerCase()) throw new Error(`Technologies are identical: "${left}"`);
    if (left.length < 2 || right.length < 2) throw new Error(`Name too short: "${left}" vs "${right}"`);

    // Clean quotes/backticks
    topic.mainTitle.left = left.replace(/^["'`]+|["'`]+$/g, '');
    topic.mainTitle.right = right.replace(/^["'`]+|["'`]+$/g, '');
    topic.mainTitle.vs = "vs";

    if (!Array.isArray(topic.differences) || topic.differences.length < 6) {
        throw new Error(`Expected at least 6 differences, received ${topic.differences?.length}`);
    }

    // Ensure distinct colors
    if (!topic.leftColor || !topic.rightColor || topic.leftColor.toLowerCase() === topic.rightColor.toLowerCase()) {
        topic.leftColor = randomColors.left;
        topic.rightColor = randomColors.right;
    }

    return topic;
}

async function callPollinationsEndpoint(prompt, selectedModel, randomColors) {
    const bodyPayload = {
        messages: [
            { 
                role: "system", 
                content: "You are an elite principal engineer and viral tech educator. You generate highly informative, concrete technical comparisons for developers. You MUST use the exact, real-world names of software tools (never placeholders like 'TECH 1')." 
            },
            { role: "user", content: prompt }
        ],
        jsonMode: true,
        temperature: 0.9,
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
            return validateAndCleanTopic(data, randomColors);
        }
    }

    if (!content) throw new Error("Empty AI response content");

    const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
    const rawParsed = JSON.parse(jsonStr.trim());

    return validateAndCleanTopic(rawParsed, randomColors);
}

async function generateWithPollinations(history, chosenDomain, modelName, randomColors) {
    const historyListStr = history.map(t => `- ${t}`).join('\n');

    const prompt = `
Generate a valid JSON object for a technical comparison visual (Short/Reel format for developers).

DOMAIN: ${chosenDomain.category}
FOCUS: ${chosenDomain.guidance}

CRITICAL REQUIREMENT - ZERO DUPLICATES:
This topic MUST BE 100% BRAND NEW and CANNOT BE ANY OF THESE PREVIOUS TOPICS:
${historyListStr}

Color Strategy:
Assign distinct, vibrant contrasting hex colors: leftColor="${randomColors.left}" and rightColor="${randomColors.right}".

NAMING RULE:
"left" and "right" in mainTitle MUST be the exact real names of two specific competing production tools or languages.
DO NOT use placeholder words like "TECH 1", "TECH 2", "Tool 1", "Tool 2", "Framework A".

Return ONLY valid JSON. No markdown code blocks, no explanation, no backticks.

JSON Schema format:
{
    "topLabel": "${chosenDomain.category}",
    "mainTitle": {
        "left": "ActualNameOfFirstTech",
        "right": "ActualNameOfSecondTech",
        "vs": "vs"
    },
    "leftSub": "Max 3 words tagline for first tech",
    "rightSub": "Max 3 words tagline for second tech",
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
4. Replace ActualNameOfFirstTech and ActualNameOfSecondTech with the actual tool names.
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
        console.error("Halting cycle to prevent publishing duplicate or placeholder content.");
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
