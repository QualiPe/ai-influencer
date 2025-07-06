<!-- Banner -->
<h1 align="center">
  <br/>
  🤖 AI-Influencer
  <br/>
  <sub>LLM-driven content studio that lives fully on-chain-friendly infra</sub>
</h1>

<p align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/QualiPe/ai-influencer?color=00d2ff">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-purple">
  <img alt="Built With" src="https://img.shields.io/badge/Built%20with-0G%20Labs%20%7C%20Fluence%20%7C%20HardHat-00d2ff">
</p>

> **AI-Influencer** is an autonomous pipeline that **writes**, **voices**, **renders** and **publishes** YouTube Shorts in response to on-chain donations.  
> The AI-Influencer self-custodies a wallet: it pays its own **Fluence** peer and **0G compute/storage** fees, earns from on-chain donations and YouTube revenue, and reinvests the proceeds to refine its content algorithms.


---

## ✨ Decentralised tools

|   Layer   | Tech | Magic |
|-----------|------|-------|
| De Hosting | **Fluence** | All containers live on a peer node you pay for **directly with a wallet**, so even hosting is automated |
| De Compute | **0G Compute** (Galileo testnet) | Runs an LLaMA-based agent that brainstorms prompts and call-sheets on demand |
| Chain | **HardHat + Ethers.js** | Solidity contract accepts donations + messages that steer future content |
| Merge | **FFmpeg** worker | Glues tracks into final MP4 inside the Fluence pod |
| AI Video | **Luma AI** | Turns the prompt into a 9-second 9:16 clip |
| AI Audio | **ElevenLabs** | Generates multilingual voice-over |
---

## 🏗️ Architecture

```text
┌──────────────┐   payment   ┌───────────────┐
│  User wallet │ ───────────▶│  0G Contract  │
└──────────────┘             └───────────────┘
        ▲                              │ event
        │                              ▼
┌─────────────────────────────────────────────────────────┐
│                Fluence peer (Docker)                    │
│ ┌───────────────┐  LLaMA  ┌──────────────────────────┐  │
│ │  NestJS API   │ ◀────── │ 0G Compute sidecar       │  │
│ ├───────────────┤ prompt  └──────────────────────────┘  │
│ │ FFmpeg worker │◀ video ── Luma AI                     │
│ │  /shared      │◀ audio ── ElevenLabs                  │
│ └───────────────┘                                       │
│        │ merge MP4  ▲                                   │
│        ▼            │ uploads                           │
│    YouTube Shorts API ◀─────────────────────────────────┘
└─────────────────────────────────────────────────────────┘


```text

🚀 Quick start
1 · Clone the repo
git clone https://github.com/QualiPe/ai-influencer.git
cd ai-influencer

2 · Add your secrets
Create two files and paste in your keys:
	•	backend/.env – TG_BOT_TOKEN, OPENAI_API_KEY, ELEVENLABS_API_KEY, YouTube keys …
	•	contracts/inft/.env – your 0G test-net private key (the bot spends & receives ETH here).

cp backend/.env.example backend/.env
cp contracts/inft/.env.example contracts/inft/.env
nano backend/.env            # edit tokens
nano contracts/inft/.env     # edit private key

The same wallet later pays Fluence for the peer and buys 0G compute / storage credits; it also receives on-chain tips.

3 · Build & run (Docker only)
docker compose build    # one-off
docker compose up -d    # start in background

Containers:
	•	ai-influencer-backend – NestJS + Telegram bot + FFmpeg worker
	•	ai-influencer-contracts – HardHat node + inft scripts (tips & topics)

4 · Talk to your creator bot
Open Telegram → /start → choose:
	•	Generate prompt → 0G compute (LLaMA)
	•	Generate video / audio → Luma AI + ElevenLabs
	•	Merge & Upload → FFmpeg → YouTube Shorts
	•	Send payment → on-chain tip; message auto-appended to content plan.

5 · Top-up and let it self-fund
	1.	Send a little Testnet ETH (Galileo) to the wallet you put in contracts/inft/.env.
	2.	Fund your Fluence peer and 0G credits from that same wallet – the bot now pays its own bills with YouTube revenue and future tips.

Your autonomous AI-Influencer is live, crafting Shorts end-to-end without a central server. 🎬
