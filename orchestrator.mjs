import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const INTERVAL_MS = 8 * 60 * 60 * 1000; // 8 hours = 3 times a day

function runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        console.log(`[EXEC] ${command} ${args.join(' ')}`);
        const proc = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${command} failed with code ${code}`));
        });
    });
}

async function runCycle() {
    console.log('\n' + '='.repeat(50));
    console.log(`🚀 STARTING AUTOMATION CYCLE: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));

    try {
        // 1. Generate New Topic
        console.log('\n🎨 STEP 1: GENERATING TOPIC...');
        await runCommand('node', ['scripts/generate_topic.mjs']);

        // 2. Read Topic for Metadata
        const topicData = JSON.parse(fs.readFileSync('src/data/current_topic.json', 'utf8'));
        const title = `${topicData.mainTitle.left} vs ${topicData.mainTitle.right}`;
        const tagline = topicData.topLabel;

        // 3. Generate AI Metadata (Captions, Hashtags)
        console.log('\n🧠 STEP 2: GENERATING METADATA...');
        await runCommand('node', ['scripts/generate_ai_metadata.mjs', `"${title}"`, `"${tagline}"`]);

        // 4. Record Video
        console.log('\n📹 STEP 3: RECORDING VIDEO...');
        await runCommand('node', ['capture_day23.mjs']);

        // 5. Upload to Social Media
        console.log('\n⬆️ STEP 4: UPLOADING...');
        // We'll create a python wrapper similar to day_7's publish script if needed, 
        // or just call the python scripts directly if we have a unified one.
        // For now, let's assume we want to run a publish script.
        if (fs.existsSync('publish_day23.py')) {
            await runCommand('python', ['publish_day23.py']);
        } else {
            console.log('⚠️ No publish_day23.py found, skipping upload.');
        }

        console.log('\n✅ CYCLE COMPLETED SUCCESSFULLY!');

    } catch (error) {
        console.error('\n❌ CYCLE FAILED:', error.message);
    }
}

async function start() {
    const isSingleRun = process.argv.includes('--single-run');

    if (isSingleRun) {
        await runCycle();
    } else {
        // Run immediately
        await runCycle();
        // Then schedule
        console.log(`\n🕒 Next run in 8 hours...`);
        setInterval(runCycle, INTERVAL_MS);
    }
}

start();
