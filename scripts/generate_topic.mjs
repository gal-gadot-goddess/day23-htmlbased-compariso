import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.POLLINATIONS_API_KEY;
const MODEL = process.env.AI_MODEL || 'gemini-fast';

const OUTPUT_FILE = path.join(__dirname, '../src/data/current_topic.json');
const HISTORY_FILE = path.join(__dirname, '../topic_history.json');

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
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-50), null, 2));
}

const PROMPT = `
Generate a valid JSON object for a technical comparison visual (Reel format).
The comparison should be between two technologies, architectures, or concepts.
Topic MUST BE UNIQUE and different from: ${getHistory().join(', ')}.
Choose highly engaging tech topics (e.g., "Tailwind vs CSS", "Next.js vs Remix", "Kubernetes vs Docker Swarm", "Kafka vs RabbitMQ", "PyTorch vs TensorFlow").

Return ONLY raw JSON. No markdown. No reasoning.

Structure:
{
    "topLabel": "UPPERCASE CATEGORY (e.g. INFRASTRUCTURE)",
    "mainTitle": {
        "left": "TECH 1",
        "right": "TECH 2",
        "vs": "vs"
    },
    "leftSub": "Short description (max 3 words)",
    "rightSub": "Short description (max 3 words)",
    "leftColor": "A vibrant hex color",
    "rightColor": "A vibrant contrasting hex color",
    "badge": "THE 7 CORE DIFFERENCES",
    "differences": [
        {
            "title": "1. CATEGORY NAME",
            "leftTitle": "Point for Tech 1 (max 3 words)",
            "rightTitle": "Point for Tech 2 (max 3 words)",
            "leftDesc": "Concise explanation (max 15 words)",
            "rightDesc": "Concise explanation (max 15 words)",
            "leftIcon": "Choose from: Database, Cpu, Network, Lock, Unlock, Zap, Server, Code, Globe, Box, Layers, Shield, Activity, ArrowRightLeft, FileCode, Search, Settings, HardDrive, Layout, Share2, Terminal",
            "rightIcon": "Choose from the same list",
            "leftVisualText": "Visual label",
            "rightVisualText": "Visual label"
        }
    ]
}

Rules:
1. Total EXACTLY 7 differences for more depth.
2. Ensure high contrast against black background.
3. Use a unique topic every time.
`;

async function fetchTopic() {
    console.log(`🚀 Generating New Topic using ${MODEL}...`);

    const postData = JSON.stringify({
        model: MODEL,
        messages: [
            { role: "system", content: "You are a senior developer creating educational tech content for social media." },
            { role: "user", content: PROMPT }
        ],
        jsonMode: true
    });

    const options = {
        hostname: 'gen.pollinations.ai',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                let content = response.choices?.[0]?.message?.content;

                if (!content) throw new Error('No content in response');

                const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/) || content.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
                
                const topic = JSON.parse(jsonStr);
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(topic, null, 2));
                
                const topicName = `${topic.mainTitle.left} vs ${topic.mainTitle.right}`;
                saveToHistory(topicName);
                
                console.log(`✅ Successfully generated: ${topicName}`);
            } catch (e) {
                console.error('❌ Generation Error:', e.message);
                process.exit(1);
            }
        });
    });

    req.on('error', (e) => {
        console.error('❌ Request Error:', e);
        process.exit(1);
    });

    req.write(postData);
    req.end();
}

fetchTopic();
