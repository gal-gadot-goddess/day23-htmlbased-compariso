import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top-ranking Google Trends queries for developer comparisons
const COMPARISON_SEARCH_TRENDS = [
    { pattern: /kafka.*rabbitmq|rabbitmq.*kafka/i, query: "Kafka vs RabbitMQ: Which Message Broker Actually Scales in Production? ⚡" },
    { pattern: /postgres.*mysql|mysql.*postgres/i, query: "PostgreSQL vs MySQL: Key Architectural Differences & Performance Benchmarks ⚡" },
    { pattern: /redis.*memcached|memcached.*redis/i, query: "Redis vs Memcached: Caching Architecture & Throughput Compared ⚡" },
    { pattern: /sql.*nosql|nosql.*sql/i, query: "SQL vs NoSQL: How High-Scale Systems Choose Their Database Architecture ⚡" },
    { pattern: /graphql.*rest|rest.*graphql/i, query: "GraphQL vs REST API: Network Latency, Over-fetching & Scaling Trade-offs ⚡" },
    { pattern: /docker.*kubernetes|kubernetes.*docker/i, query: "Docker vs Kubernetes: Containerization vs Orchestration Explained Simply ⚡" },
    { pattern: /monolith.*microservice/i, query: "Monolithic vs Microservices: When Should You Actually Decompose Your Architecture? ⚡" },
    { pattern: /tcp.*udp|udp.*tcp/i, query: "TCP vs UDP: Packet Loss, Latency, and Transport Layer Performance ⚡" },
    { pattern: /grpc.*rest|rest.*grpc/i, query: "gRPC vs REST: Protocol Buffers vs JSON for High-Throughput Microservices ⚡" },
    { pattern: /mongodb.*postgresql|postgres.*mongo/i, query: "MongoDB vs PostgreSQL: Document Stores vs Relational ACID Explained ⚡" },
    { pattern: /elasticsearch.*solr/i, query: "Elasticsearch vs Solr: Full-Text Search Engine Architecture Breakdown ⚡" },
    { pattern: /websocket.*sse|sse.*websocket/i, query: "WebSockets vs Server-Sent Events (SSE): Real-Time Communication Trade-offs ⚡" },
    { pattern: /jwt.*session|session.*jwt/i, query: "JWT vs Server Sessions: Authentication Scalability & Security In Production ⚡" }
];

function getTrendingSearchQuery(title) {
    for (const item of COMPARISON_SEARCH_TRENDS) {
        if (item.pattern.test(title)) {
            return item.query;
        }
    }
    return `${title}: Which Architecture Actually Scales in Production? ⚡`;
}

async function fetchWithTimeout(resource, options = {}, timeout = 25000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

function sanitizeHashtags(tags) {
    const clean = ['#kreggscode'];
    if (Array.isArray(tags)) {
        for (let t of tags) {
            let ct = String(t).trim().toLowerCase();
            if (!ct.startsWith('#')) ct = '#' + ct;
            ct = ct.replace(/[^#a-z0-9_]/g, '');
            if (ct.length > 2 && !clean.includes(ct)) clean.push(ct);
        }
    } else if (typeof tags === 'string') {
        for (let t of tags.split(/\s+/)) {
            let ct = t.trim().toLowerCase();
            if (!ct.startsWith('#')) ct = '#' + ct;
            ct = ct.replace(/[^#a-z0-9_]/g, '');
            if (ct.length > 2 && !clean.includes(ct)) clean.push(ct);
        }
    }

    const fallbacks = ['#systemdesign', '#softwareengineering', '#coding', '#backend', '#artificialintelligence'];
    for (let f of fallbacks) {
        if (clean.length >= 5) break;
        if (!clean.includes(f)) clean.push(f);
    }
    return clean.slice(0, 5);
}

async function generateMetadata(title, tagline) {
    const trendingQuery = getTrendingSearchQuery(title);

    const prompt = `
You are a senior system architect and viral social media growth engineer managing @kreggscode (https://kreggscode.com).
We are publishing a high-retention architectural comparison post on Facebook:
Topic: "${title}"
Domain/Category: "${tagline}"
Target Google Search Query Hook: "${trendingQuery}"

GOOGLE SEARCH & FACEBOOK SEO OPTIMIZATION TARGETS:
- The title MUST be a viral comparison hook under 65 chars (e.g. "${title}: Which One Actually Scales? ⚡").
- fb_caption MUST be an SEO-optimized technical breakdown:
  * First line: High-intent search hook ("${trendingQuery}").
  * 3-5 clean bullet points analyzing throughput, latency, consistency, failure modes, and operational overhead.
  * Recommendation on which one to choose for production.
  * Clear call-to-actions linking to Instagram (@kreggscode), website, and apps:
    ⚡ Follow our official Instagram for daily animated system architecture reels: https://instagram.com/kreggscode (@kreggscode)
    🌐 Interactive visualizers & guides: https://kreggscode.com
    📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/

RETURN STRICTLY A VALID JSON OBJECT with these exact keys:
- title: "${title}: Which One Actually Scales? ⚡"
- fb_caption: "Complete SEO technical breakdown as described above"
- threads_caption: "Punchy developer debate question with https://kreggscode.com (under 280 chars)."
- yt_description: "High-converting YouTube Shorts description with search-optimized summary, mechanics, #Shorts tags, and official links:
  🔗 KreggsCode Ecosystem & Verified Resources:
  🌐 Platform & Guides: https://kreggscode.com
  📱 iOS & AI Apps: https://kreggscode.com/apps/
  📸 Instagram: https://www.instagram.com/kreggscode/
  🐦 X (Twitter): https://x.com/kreggscode"
- yt_tags: ["kreggscode", "system design", "software engineering", "coding", "technology", "artificial intelligence", "backend architecture"]
- hashtags: strictly 5 lowercase hashtags always starting with "#kreggscode" (e.g. ["#kreggscode", "#systemdesign", "#softwareengineering", "#coding", "#backend"])

Rules:
- No Markdown formatting inside json keys (** or ##).
- Do not output backticks or conversational preamble. Return JSON only.
`;

    const fallback_metadata = {
        title: `${title}: Architectural Trade-offs & Production Scaling ⚡`,
        fb_caption: (
            `Deep-Dive Architecture Breakdown: ${trendingQuery}\n\n`
            + `Every software engineering team faces architectural trade-offs when selecting their toolset for ${tagline}. Today we examine the fundamental differences in deployment, performance, and scaling between these two approaches.\n\n`
            + `• Scalability & Throughput: How each handles concurrent traffic and data volume under production load.\n`
            + `• Operational Overhead: Maintenance, observability, fault tolerance, and cluster management.\n`
            + `• Key Takeaway: Choose based on latency requirements, consistency contracts, and team ergonomics.\n\n`
            + `Which architecture do you rely on in production? Drop your perspective in the comments! 👇\n\n`
            + `⚡ Looking for more software architecture breakdowns and animated visualizers?\n`
            + `📸 Follow our official Instagram: https://instagram.com/kreggscode (@kreggscode)\n`
            + `🌐 Explore interactive developer tools: https://kreggscode.com\n`
            + `📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/`
        ),
        threads_caption: `${title}: Choosing between them comes down to scalability, development velocity, and system requirements. Which one do you prefer? https://kreggscode.com | Follow @kreggscode`,
        yt_description: (
            `Complete technical breakdown of ${title} (${tagline}).\n\n`
            + `Comparing architecture, scalability, complexity, and performance trade-offs to help you decide which tool fits your high-scale systems.\n\n`
            + `🔗 KreggsCode Ecosystem & Verified Resources:\n`
            + `🌐 Platform & Guides: https://kreggscode.com\n`
            + `📱 iOS & AI Apps: https://kreggscode.com/apps/\n`
            + `📸 Instagram: https://www.instagram.com/kreggscode/\n`
            + `🐦 X (Twitter): https://x.com/kreggscode\n\n`
            + `#Shorts #kreggscode #systemdesign #coding #softwareengineering #technology #artificialintelligence`
        ),
        yt_tags: [
            "kreggscode", "system design", "software engineering", "coding",
            "technology", "artificial intelligence", "backend architecture"
        ],
        hashtags: [
            "#kreggscode", "#systemdesign", "#softwareengineering", "#coding", "#backend"
        ]
    };

    try {
        const bodyPayload = {
            messages: [{ role: 'user', content: prompt }],
            jsonMode: true,
            temperature: 0.8,
            seed: Math.floor(Math.random() * 1000000)
        };

        const API_KEY = process.env.POLLINATIONS_API_KEY || '';
        const MODEL = process.env.AI_MODEL || 'openai-fast';

        let response = null;

        if (API_KEY) {
            try {
                response = await fetchWithTimeout('https://gen.pollinations.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({ ...bodyPayload, model: MODEL })
                }, 25000);
            } catch (e) {
                console.warn(`[AI Metadata] gen endpoint failed: ${e.message}. Trying public text endpoint...`);
            }
        }

        if (!response || !response.ok) {
            response = await fetchWithTimeout('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...bodyPayload, model: 'openai' })
            }, 25000);
        }

        if (!response.ok) {
            throw new Error(`Pollinations HTTP ${response.status}: ${await response.text()}`);
        }

        const fullResponse = await response.json();
        let content = fullResponse.choices?.[0]?.message?.content || (typeof fullResponse === 'string' ? fullResponse : null);

        let data = null;
        if (content) {
            const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                data = JSON.parse((jsonMatch[1] || jsonMatch[0]).trim());
            }
        } else if (fullResponse && typeof fullResponse === 'object' && fullResponse.title) {
            data = fullResponse;
        }

        if (data) {
            if (!data.fb_caption || !data.fb_caption.includes('kreggscode.com')) {
                data.fb_caption = (data.fb_caption || fallback_metadata.fb_caption) +
                    `\n\n⚡ Follow our official Instagram: https://instagram.com/kreggscode (@kreggscode)\n🌐 Explore interactive developer tools & apps at https://kreggscode.com and https://kreggscode.com/apps/`;
            }

            if (!data.yt_description || !data.yt_description.includes('kreggscode.com')) {
                data.yt_description = fallback_metadata.yt_description;
            }

            if (!data.yt_tags) {
                data.yt_tags = fallback_metadata.yt_tags;
            }

            data.hashtags = sanitizeHashtags(data.hashtags || fallback_metadata.hashtags);
            return data;
        }

        throw new Error('No valid JSON found in AI response content');
    } catch (error) {
        console.warn('⚠️ Error generating AI metadata, using Google Trends SEO fallback template:', error.message);
        return fallback_metadata;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const title = args[0] || 'SQL vs NoSQL';
    const tagline = args[1] || 'DATABASE ARCHITECTURE';

    console.log(`🤖 Generating Google Trends AI metadata for: ${title} (${tagline})...`);
    const metadata = await generateMetadata(title, tagline);

    fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));
    console.log('✅ Metadata saved to metadata.json');
    process.exit(0);
}

main();
