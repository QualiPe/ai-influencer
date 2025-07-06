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
  <img alt="Built With" src="https://img.shields.io/badge/Built%20with-0G%20Compute%20%7C%20HardHat%20%7C%20Fluence-00d2ff">
</p>

> **AI-Influencer** is an autonomous pipeline that **writes**, **voices**, **renders** and **publishes** YouTube Shorts in response to on-chain donations.  
> Every step — from prompt generation to video upload — runs inside Docker containers pinned to a **Fluence peer**, so the whole show is serverless-style and wallet-payable.

---

## ✨ Why it’s cool

| Layer | Tech | Magic |
|-------|------|-------|
| Hosting | **Fluence** | All containers live on a peer node you pay for **directly with a wallet**, so even hosting is automated |
| Compute | **0G Compute** (Galileo testnet) | Runs an LLaMA-based agent that brainstorms prompts and call-sheets on demand |
| Chain | **HardHat + Ethers.js** | Solidity contract accepts donations + messages that steer future content |
| Merge | **FFmpeg** worker | Glues tracks into final MP4 inside the Fluence pod |
| Video | **Luma AI** | Turns the prompt into a 9-second 9:16 clip |
| Audio | **ElevenLabs** | Generates multilingual voice-over |
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
