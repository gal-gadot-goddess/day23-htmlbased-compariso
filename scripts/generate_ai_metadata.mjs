import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const API_KEY = process.env.POLLINATIONS_API_KEY;
const MODEL = process.env.AI_MODEL || 'openai';

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

function sanitizeHashtags(rawTags) {
    const clean = [];
    clean.push('#kreggscode');

    if (Array.isArray(rawTags)) {
        for (let t of rawTags) {
            if (typeof t !== 'string') continue;
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
    const prompt = `
You are a senior system architect and viral social media growth engineer managing @kreggscode (https://kreggscode.com).
We are publishing a high-retention architectural comparison reel:
Topic: "${title}"
Domain/Category: "${tagline}"

GOOGLE SEARCH TRENDS & OPTIMIZATION TARGETS:
- Frame the comparison around questions developers and system designers search for on Google (e.g., "${title}: Which One Scales in Production? ⚡", "System Design Interview: ${title} Breakdown").
- The FIRST 120 CHARACTERS of "ig_caption" MUST be an irresistible search hook for Google "Short Videos" crawling.
- Emphasize trade-offs: latency, throughput, complexity, fault-tolerance, and production scaling.

RETURN STRICTLY A VALID JSON OBJECT with these exact keys:
- title: "Viral SEO comparison hook title under 65 chars with an emoji (e.g. ${title}: Which One Actually Scales? ⚡)"
- ig_caption: "High-retention Instagram caption with:
  * First 2 lines (under 120 chars): Target search query hook with keywords (technology, system design, software engineering).
  * 4-6 clean bullet points breaking down mechanical trade-offs under the hood.
  * Real-world engineering recommendation or interview tip.
  * Debate prompt to drive comments.
  * Mandatory brand footer:
    🔗 Interactive visualizers & guides: https://kreggscode.com
    📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/
    Follow @kreggscode | AI & System Architecture Studio"
- fb_caption: "In-depth, conversational technical write-up for Facebook engineering groups explaining production trade-offs with links to https://kreggscode.com and https://kreggscode.com/apps/."
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
        ig_caption: (
            `⚡ ${title} Architecture Breakdown!\n\n`
            + `How modern technology, scalable backend systems, and artificial intelligence architectures choose between ${title} under the hood.\n\n`
            + `• Category: ${tagline}\n`
            + `• Key evaluation criteria: Latency, throughput, state management, and operational complexity\n`
            + `• Production takeaway: Choose based on team ergonomics, data consistency contracts, and horizontal scale\n\n`
            + `Which architecture do you rely on in production? Drop your perspective below! 👇\n\n`
            + `🔗 Interactive visualizers & guides: https://kreggscode.com\n`
            + `📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/\n`
            + `Follow @kreggscode | AI & System Architecture Studio`
        ),
        threads_caption: `${title}: Choosing between them comes down to scalability, development velocity, and system requirements. Which one do you prefer? https://kreggscode.com | Follow @kreggscode`,
        fb_caption: (
            `Deep-Dive Architecture Breakdown: ${title} (${tagline})\n\n`
            + `Every software engineering team faces architectural trade-offs when selecting their toolset. Today we examine the fundamental differences in deployment, performance, and scaling between these two approaches.\n\n`
            + `What has your production experience been with this architecture? Let's discuss in the comments!\n\n`
            + `Explore interactive developer tools & apps at https://kreggscode.com and https://kreggscode.com/apps/\n`
            + `Follow @kreggscode for daily technical comparisons and software architecture breakdowns.`
        ),
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
            if (!data.ig_caption || !data.ig_caption.includes('kreggscode.com')) {
                data.ig_caption = (data.ig_caption || fallback_metadata.ig_caption) +
                    `\n\n🔗 Interactive visualizers & guides: https://kreggscode.com\n📱 iOS & AI Apps on App Store: https://kreggscode.com/apps/\nFollow @kreggscode | AI & System Architecture Studio`;
            }

            if (!data.fb_caption || !data.fb_caption.includes('kreggscode.com')) {
                data.fb_caption = (data.fb_caption || fallback_metadata.fb_caption) +
                    `\n\nExplore interactive developer tools & apps at https://kreggscode.com and https://kreggscode.com/apps/\nFollow @kreggscode for daily technical comparisons and software architecture breakdowns.`;
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
