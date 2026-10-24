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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    // Clean up any stale temp files from prior aborted cycles
    if (fs.existsSync(VIDEO_ONLY)) {
        try { fs.unlinkSync(VIDEO_ONLY); } catch (e) {}
    }
    if (fs.existsSync(FINAL_OUTPUT)) {
        try { fs.unlinkSync(FINAL_OUTPUT); } catch (e) {}
    }

    // Pick a random audio track from the local viral folder
    const audioFiles = fs.readdirSync(VIRAL_DIR).filter(f => f.endsWith('.mp3'));
    if (audioFiles.length === 0) {
        throw new Error(`No mp3 audio files found in ${VIRAL_DIR}`);
    }
    const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    const AUDIO_FILE = path.join(VIRAL_DIR, randomAudio);
    console.log(`🎵 Selected Audio: ${randomAudio}`);
    console.log('🚀 Starting Vite Server...');
    const viteProcess = exec('npm run dev', { cwd: __dirname });

    // Auto-detect URL from vite output
    let VITE_URL = 'http://127.0.0.1:3000'; // default fallback
    const urlDetected = new Promise(resolve => {
        viteProcess.stdout.on('data', (data) => {
            const str = data.toString();
            console.log(`[Vite] ${str.trim()}`);
            const match = str.match(/http:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|10\.[^:\s]+|172\.[^:\s]+):(\d+)/);
            if (match) {
                VITE_URL = match[0];
                console.log(`📡 Detected URL: ${VITE_URL}`);
                resolve();
            }
        });
        viteProcess.stderr.on('data', (data) => {
            console.error(`[Vite ERR] ${data.toString().trim()}`);
        });
        // Fallback after 10s
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
    let navigationSuccess = false;
    for (let navAttempt = 1; navAttempt <= 3; navAttempt++) {
        try {
            await page.goto(VITE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
            console.log('✅ Navigation successful.');
            navigationSuccess = true;
            await page.screenshot({ path: path.join(__dirname, 'debug_view.png') });
            break;
        } catch (err) {
            console.warn(`⚠️ Navigation attempt ${navAttempt} failed: ${err.message}`);
            if (navAttempt < 3) await sleep(2000);
        }
    }

    if (!navigationSuccess) {
        console.warn('⚠️ Proceeding with recording despite navigation warnings...');
    }

    await sleep(2000);

    const recorder = new PuppeteerScreenRecorder(page, {
        fps: 60,
        videoFrame: { width: 1080, height: 1920 },
        videoBitrate: 8000,
    });

    console.log('⏺️ Recording started (18 seconds)...');
    await recorder.start(VIDEO_ONLY);
    await sleep(18000);
    await recorder.stop();
    console.log('⏹️ Recording stopped.');

    await browser.close();

    console.log('💀 Killing Vite server...');
    try {
        viteProcess.kill('SIGTERM');
        setTimeout(() => {
            try { viteProcess.kill('SIGKILL'); } catch (e) {}
        }, 1000);
    } catch (e) {}

    if (fs.existsSync(AUDIO_FILE) && fs.existsSync(VIDEO_ONLY)) {
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
    } else if (fs.existsSync(VIDEO_ONLY)) {
        fs.renameSync(VIDEO_ONLY, FINAL_OUTPUT);
    }

    if (!fs.existsSync(FINAL_OUTPUT)) {
        throw new Error(`Failed to create video file at ${FINAL_OUTPUT}`);
    }

    console.log('🏁 Capture script finished successfully.');
    process.exit(0);
}

run().catch((err) => {
    console.error('❌ Capture script fatal error:', err);
    process.exit(1);
});
