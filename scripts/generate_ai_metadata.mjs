import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const POLLINATIONS_API_URL = 'https://gen.pollinations.ai/v1/chat/completions';

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

async function generateMetadata(title, tagline) {
    const prompt = `
You are a senior developer and viral tech educator.
Create a comprehensive social media release package for an architectural comparison reel/short:
Topic: "${title}"
Category: "${tagline}"

RETURN ONLY A VALID JSON OBJECT with exactly these keys:
- title: "Punchy, exciting comparison title (e.g. ${title}: Which One Should You Choose?)"
- ig_caption: "Educational masterclass caption for Instagram (max 1800 chars). Breakdown why developers choose either side with key trade-offs, architecture context, and a question to prompt comments."
- threads_caption: "Snappy developer hot-take/summary for Threads (strictly under 450 chars)."
- fb_caption: "Conversational, highly engaging post for Facebook tech communities (no strict char limit)."
- yt_description: "SEO-optimized YouTube Shorts description with timestamps placeholders and rich explanation (max 3000 chars)."
- tiktok_caption: "Ultra-engaging hook caption for TikTok/Reels with call to action (max 400 chars)."
- hashtags: ["#WebDev", "#SoftwareEngineering", "#Coding", "#Tech", "#Programming"]

Rules:
- No Markdown formatting inside json keys (** or ##).
- Do not output backticks or conversational preamble.
`;

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${process.env.POLLINATIONS_API_KEY}`;
        }

        const response = await fetchWithTimeout(POLLINATIONS_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: 'gemini-fast',
                jsonMode: true,
                seed: Math.floor(Math.random() * 1000000)
            })
        }, 25000);

        if (!response.ok) {
            throw new Error(`Pollinations HTTP ${response.status}: ${await response.text()}`);
        }

        const fullResponse = await response.json();
        const content = fullResponse.choices?.[0]?.message?.content || "";

        const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse((jsonMatch[1] || jsonMatch[0]).trim());
        }

        throw new Error('No valid JSON found in AI response content');
    } catch (error) {
        console.warn('⚠️ Error generating AI metadata, using smart fallback template:', error.message);
        return {
            title: `${title}: The Complete Architectural Comparison`,
            ig_caption: `Breaking down the architectural showdown: ${title} (${tagline})!\n\nBoth technologies solve crucial problems, but each comes with its own trade-offs across performance, complexity, scaling, and ergonomics.\n\nCheck out the 7 core differences in this breakdown to decide which one fits your stack best. Which one are you currently using in production? Let us know in the comments below!`,
            threads_caption: `${title}: Choosing between them comes down to scalability, development speed, and architectural requirements. Which one do you prefer in your stack?`,
            fb_caption: `Deep dive into ${title}!\n\nEvery engineering team faces architectural trade-offs when selecting their toolset. Today we examine the fundamental differences in deployment, performance, and scaling between these two approaches. Check out the visual breakdown!`,
            yt_description: `Complete technical breakdown of ${title} (${tagline}).\n\nComparing architecture, scalability, complexity, and performance trade-offs to help you decide which tool fits your next project.\n\n#SoftwareEngineering #Tech #Programming #Coding #Developer`,
            tiktok_caption: `${title} explained in seconds! Which one is better for your project? Drop your pick below!`,
            hashtags: [
                "#TechComparison", "#Coding", "#SoftwareEngineering", "#WebDev",
                "#Architecture", "#SystemDesign", "#Developer", "#Programming"
            ]
        };
    }
}

async function main() {
    const args = process.argv.slice(2);
    const title = args[0] || 'SQL vs NoSQL';
    const tagline = args[1] || 'DATABASE ARCHITECTURE';

    console.log(`🤖 Generating AI metadata for: ${title} (${tagline})...`);
    const metadata = await generateMetadata(title, tagline);

    fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));
    console.log('✅ Metadata saved to metadata.json');
    process.exit(0);
}

main();
