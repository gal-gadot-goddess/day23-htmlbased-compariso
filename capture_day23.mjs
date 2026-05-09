import puppeteer from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';
import fs from 'fs';
import path from 'path';
import { exec, execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const VIDEO_ONLY = path.join(__dirname, 'temp_video.mp4');
const FINAL_OUTPUT = path.join(__dirname, 'recording.mp4');
const VIRAL_DIR = path.join(__dirname, 'viral');

async function run() {
    // Pick a random audio track from the local viral folder
    const audioFiles = fs.readdirSync(VIRAL_DIR).filter(f => f.endsWith('.mp3'));
    const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    const AUDIO_FILE = path.join(VIRAL_DIR, randomAudio);
    console.log(`🎵 Selected Audio: ${randomAudio}`);
    console.log('🚀 Starting Vite Server...');
    const viteProcess = exec('npm run dev', { cwd: __dirname });

    // Auto-detect URL from vite output
    let VITE_URL = 'http://127.0.0.1:3000'; // fallback
    const urlDetected = new Promise(resolve => {
        viteProcess.stdout.on('data', (data) => {
            console.log(`[Vite] ${data}`);
            const match = data.match(/http:\/\/(127\.0\.0\.1|localhost|10\.[^:\s]+|172\.[^:\s]+):3000/);
            if (match) {
                VITE_URL = match[0];
                console.log(`📡 Detected URL: ${VITE_URL}`);
                resolve();
            }
        });
        // Also fallback after 10s
        setTimeout(resolve, 10000);
    });

    await urlDetected;

    console.log('📸 Launching Puppeteer...');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--window-size=1080,1920',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--hide-scrollbars',
            '--mute-audio'
        ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1920 });

    // Debugging: Log browser console
    page.on('console', msg => console.log(`[BROWSER] ${msg.text()}`));
    page.on('pageerror', err => console.log(`[BROWSER ERROR] ${err.toString()}`));

    console.log(`🔗 Navigating to ${VITE_URL}...`);
    try {
        await page.goto(VITE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        console.log('✅ Navigation successful.');
        await page.screenshot({ path: path.join(__dirname, 'debug_view.png') });
    } catch (err) {
        console.warn('⚠️ Navigation timeout or error:', err.message);
    }

    await new Promise(r => setTimeout(r, 2000));

    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 60,
        videoFrame: { width: 1080, height: 1920 },
        videoBitrate: 8000,
    });

    console.log('⏺️ Recording started (18 seconds)...');
    await recorder.start(VIDEO_ONLY);
    await new Promise(r => setTimeout(r, 18000));
    await recorder.stop();
    console.log('⏹️ Recording stopped.');

    await browser.close();

    console.log('💀 Killing Vite server...');
    viteProcess.kill();

    if (fs.existsSync(AUDIO_FILE)) {
        console.log('🎵 Merging with audio...');
        let ffmpegPath = path.join(__dirname, '../node_modules/ffmpeg-static/ffmpeg.exe');
        if (!fs.existsSync(ffmpegPath)) ffmpegPath = 'ffmpeg';

        try {
            execSync(`"${ffmpegPath}" -y -i "${VIDEO_ONLY}" -i "${AUDIO_FILE}" -c:v copy -c:a aac -shortest "${FINAL_OUTPUT}"`);
            console.log(`✅ FINAL VIDEO SAVED: ${FINAL_OUTPUT}`);
            if (fs.existsSync(VIDEO_ONLY)) fs.unlinkSync(VIDEO_ONLY);
        } catch (err) {
            console.error('❌ FFmpeg merge failed:', err);
            fs.renameSync(VIDEO_ONLY, FINAL_OUTPUT);
        }
    } else {
        fs.renameSync(VIDEO_ONLY, FINAL_OUTPUT);
    }
}

run().catch(console.error);
