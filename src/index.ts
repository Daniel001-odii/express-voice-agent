import 'dotenv/config';
import express from 'express';
import { initializeLogger, Worker, WorkerOptions } from '@livekit/agents';
import { AccessToken } from 'livekit-server-sdk';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import os from 'os';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

initializeLogger({ level: 'debug', pretty: true });

// Robustly handle Google Application Credentials
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (creds.startsWith('{')) {
        // It's a JSON string, write it to a temp file
        const tempPath = path.join(os.tmpdir(), `google-creds-${Date.now()}.json`);
        fs.writeFileSync(tempPath, creds);
        process.env.GOOGLE_APPLICATION_CREDENTIALS = tempPath;
        console.log(`Using credentials from JSON string, saved to ${tempPath}`);
    } else {
        // It's a path, ensure it's absolute
        process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(creds);
        console.log(`Using credentials from file: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    }
} else if (fs.existsSync(path.resolve('./service-account.json'))) {
    // Default to local service-account.json if it exists and env is not set
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('./service-account.json');
    console.log(`Using local service-account.json: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
}

// 1. Token Endpoint for the Frontend
app.get('/get-token', async (req, res) => {
    const roomName = (req.query.room as string) || 'voice-chat';
    const participantName = (req.query.user as string) || 'user';

    const token = new AccessToken(
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
        { identity: participantName }
    );

    token.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    res.json({ token: await token.toJwt() });
});

// 2. Start the Agent Worker
const worker = new Worker(
    new WorkerOptions({
        agent: path.resolve('./src/agent.ts'),
        wsURL: process.env.LIVEKIT_URL!,
        apiKey: process.env.LIVEKIT_API_KEY!,
        apiSecret: process.env.LIVEKIT_API_SECRET!,
    })
);

worker.run();

app.listen(port, () => console.log(`Server live at http://localhost:${port}`));