# 🎙️ Leo: Real-Time Multimodal Voice Agent

Leo is a high-performance, low-latency voice assistant that can hear, process, and speak in real-time. Built with the **LiveKit Agents Framework** and **Google Gemini 2.5 Flash**, it leverages native multimodal capabilities for natural, fluid conversations.

## ✨ Features

-   **Multimodal Intelligence**: Powered by `gemini-2.5-flash-native-audio-preview` for direct audio-to-audio processing.
-   **Real-Time Streaming**: Low-latency communication via **LiveKit**.
-   **Context-Aware**: Uses a dedicated `prompt.ts` to define Leo's personality and goals.
-   **Transcription**: Full support for input and output audio transcription for UI accessibility.
-   **Auto-Shutdown**: Integrated idle timeout to conserve resources when the conversation ends.
-   **Robust Credentials**: Secure handling of Google Service Account JSON through environment variables or local files.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express, TypeScript
-   **AI Model**: Google Gemini 2.5 Flash (Multimodal)
-   **Real-time Infrastructure**: LiveKit
-   **Frontend**: Vanilla JS / HTML (LiveKit Client SDK)

---

## 🚀 Getting Started

### 1. Prerequisites
-   A [LiveKit Cloud](https://cloud.livekit.io/) account (or self-hosted instance).
-   A [Google Cloud Project](https://console.cloud.google.com/) with the Gemini API enabled.
-   Node.js (v18+) and npm installed.

### 2. Environment Setup
Create a `.env` file in the root directory and populate it with your credentials:

```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# For Google Authentication:
# You can provide the path to your service account file:
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json

# OR the raw JSON string (ideal for production deployment):
# GOOGLE_APPLICATION_CREDENTIALS='{"type": "service_account", ...}'
```

### 3. Installation
```bash
npm install
```

### 4. Running the Project

**Development Mode:**
Starts both the Express server and the LiveKit Agent worker with hot-reload.
```bash
npm run dev
```

**Production Mode:**
Build the TypeScript source and run the compiled outputs.
```bash
npm run build
npm start
```

---

## 🏗️ Architecture

1.  **Express Server (`src/index.ts`)**: Handles metadata, generates LiveKit Access Tokens for clients, and orchestrates the Agent Worker.
2.  **Voice Agent (`src/agent.ts`)**: The "brain" of the operation. It connects to LiveKit rooms, initializes the Gemini session, and manages conversation state.
3.  **Client (`client/agent.html`)**: A lightweight frontend that connects to the server to fetch a token and joins the LiveKit room to interact with Leo.

## 🛡️ Security
This project is configured to ignore sensitive files:
-   `.env` and `service-account.json` are included in `.gitignore`.
-   Never commit your private keys or API secrets to version control.

## 📜 License
ISC License
