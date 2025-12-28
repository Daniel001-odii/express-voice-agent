import { voice, defineAgent, type JobContext } from '@livekit/agents';
import * as google from '@livekit/agents-plugin-google';
import { prompt } from './prompt.js';


export default defineAgent({
    entry: async (ctx: JobContext) => {
        await ctx.connect(); // Connect to the LiveKit Room

        // 1. Initialize the Gemini Realtime Model
        const session = new voice.AgentSession({
            llm: new google.beta.realtime.RealtimeModel({
                model: "gemini-2.5-flash-native-audio-preview", // The multimodal brain
                voice: "Puck",
                inputAudioTranscription: {}, // Allows UI captions
                outputAudioTranscription: {},
            }),
        });

        // 2. Initialize the Agent
        const agent = new voice.Agent({
            instructions: prompt
        });

        // 3. Start the Session
        await session.start({ agent, room: ctx.room });

        // 3. Kick off the conversation with a greeting
        await session.generateReply();


        // Inside the entry function...
        (session as any).on('agent_state_changed', (ev: any) => {
            console.log(`Agent is now: ${ev.newState}`); // 'speaking', 'thinking', or 'listening'
        });

        // Idle timeout: Stop the worker if no one speaks for 10 minutes
        let lastActivity = Date.now();
        (session as any).on('user_input_transcribed', () => lastActivity = Date.now());

        setInterval(() => {
            if (Date.now() - lastActivity > 10 * 60 * 1000) {
                ctx.shutdown(); // Gracefully exit
            }
        }, 30000);
    }
});
