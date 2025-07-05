# AI Influencer Integration Guide

This guide explains how to use the complete AI influencer system that combines video generation, INFT creation, and 0G storage.

## 🎯 Overview

The system consists of three main components:
1. **Backend API** - Handles video generation, AI processing, and INFT operations
2. **Smart Contracts** - Manages INFT minting and metadata storage
3. **0G Storage** - Provides encrypted, decentralized storage for all data

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run build
npm run start:dev
```

The server will be available at `http://localhost:3000`

### 2. Test the API

```bash
# Test all endpoints
node test-inft-api.js
```

### 3. Run the Complete Demo

```bash
# Run the full pipeline demo
npx ts-node src/demo/inft-pipeline-demo.ts
```

## 📡 API Endpoints

### Create a Social Agent

```bash
curl -X POST http://localhost:3000/inft/agent \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "name": "TechGuru Alex",
      "personality": "Enthusiastic tech expert",
      "niche": "tech",
      "targetAudience": "millennials",
      "contentStyle": "Educational and entertaining",
      "videoResolution": "1080p",
      "videoDuration": 90,
      "videoStyle": "modern",
      "aiModel": "gpt-4",
      "voiceModel": "elevenlabs",
      "avatarModel": "stable-diffusion"
    },
    "ownerPublicKey": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

### Generate Video Content

```bash
curl -X POST http://localhost:3000/inft/content \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "your_agent_id",
    "topic": "The Future of AI in 2024"
  }'
```

### Mint Content as INFT

```bash
curl -X POST http://localhost:3000/inft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "0xabcdef1234567890abcdef1234567890abcdef12",
    "videoContent": {
      "videoUrl": "path/to/video.mp4",
      "thumbnailUrl": "path/to/thumbnail.jpg",
      "script": "Video script content",
      "topic": "Video topic",
      "analysis": {
        "predictedViews": 50000,
        "predictedLikes": 2500,
        "predictedShares": 500,
        "engagementRate": 0.05,
        "viralityScore": 0.3
      }
    }
  }'
```

### Complete Pipeline (All-in-One)

```bash
curl -X POST http://localhost:3000/inft/pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "name": "TechGuru Alex",
      "personality": "Enthusiastic tech expert",
      "niche": "tech",
      "targetAudience": "millennials",
      "contentStyle": "Educational and entertaining",
      "videoResolution": "1080p",
      "videoDuration": 90,
      "videoStyle": "modern",
      "aiModel": "gpt-4",
      "voiceModel": "elevenlabs",
      "avatarModel": "stable-diffusion"
    },
    "ownerPublicKey": "0x1234567890abcdef1234567890abcdef12345678"
  }'
```

## 🔗 Smart Contract Integration

### Deploy Contracts

```bash
cd contracts/inft
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network 0g-testnet
```

### Connect Backend to Contracts

Update the `INFTService.ts` to use real contract instances:

```typescript
// Replace mock contract with real contract
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  signer
);
```

## 🔐 0G Storage Integration

### Current Implementation

The system currently uses mock 0G storage. To integrate with real 0G storage:

1. Install 0G SDK:
```bash
npm install @0glabs/0g-ts-sdk
```

2. Update the storage service:
```typescript
import { ZeroGStorage } from '@0glabs/0g-ts-sdk';

const storage = new ZeroGStorage({
  apiKey: process.env.ZERO_G_STORAGE_KEY
});
```

3. Replace mock storage calls with real 0G storage calls.

## 🎬 Content Generation Pipeline

### Step-by-Step Process

1. **Topic Selection**
   - System automatically selects trending topics
   - Can be customized per agent

2. **Prompt Generation**
   - GPT creates engaging video scripts
   - Tailored to agent personality

3. **Video Generation**
   - Luma AI generates high-quality videos
   - Customizable resolution and style

4. **Audio Synthesis**
   - ElevenLabs creates natural voiceovers
   - Matches agent personality

5. **Content Analysis**
   - Predicts engagement metrics
   - Calculates virality score

6. **Encryption & Storage**
   - Encrypts all metadata
   - Stores on 0G storage

7. **INFT Minting**
   - Creates tradeable NFT
   - Links to encrypted content

## 📊 Data Flow

```
Topic → GPT Prompt → Luma Video → TTS Audio → Merge → Analysis → Encrypt → 0G Storage → INFT Mint
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# AI Services
OPENAI_API_KEY=your_openai_key
LUMA_API_KEY=your_luma_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Blockchain
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url

# 0G Storage
ZERO_G_STORAGE_KEY=your_0g_key

# Server
PORT=3000
NODE_ENV=development
```

### Agent Configuration

```typescript
interface SocialAgentConfig {
  name: string;                    // Agent display name
  personality: string;             // AI personality traits
  niche: string;                   // Content category
  targetAudience: string;          // Target demographic
  contentStyle: string;            // Video style preferences
  videoResolution: string;         // Output quality
  videoDuration: number;           // Target length (seconds)
  videoStyle: string;              // Visual style
  aiModel: string;                 // GPT model version
  voiceModel: string;              // TTS service
  avatarModel: string;             // Avatar generation model
}
```

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
cd backend
npm test

# Contract tests
cd contracts/inft
npx hardhat test

# API tests
node test-inft-api.js
```

### Manual Testing

1. Start the server: `npm run start:dev`
2. Test health endpoint: `curl http://localhost:3000/inft/health`
3. Create an agent using the API
4. Generate content
5. Mint as INFT
6. Verify on blockchain explorer

## 🚀 Production Deployment

### Docker Deployment

```bash
# Build image
docker build -t ai-influencer-backend .

# Run container
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e LUMA_API_KEY=your_key \
  -e ELEVENLABS_API_KEY=your_key \
  ai-influencer-backend
```

### Environment Setup

1. Set up production environment variables
2. Configure database (if needed)
3. Set up monitoring and logging
4. Configure SSL certificates
5. Set up load balancing

## 📈 Monitoring

### Key Metrics

- **Agent Performance**: Views, engagement, revenue
- **Content Quality**: Virality scores, engagement rates
- **INFT Trading**: Sales volume, price trends
- **Storage Usage**: 0G storage consumption
- **API Performance**: Response times, error rates

### Logging

The system logs all operations with emojis for easy identification:
- 🤖 Agent operations
- 🎬 Content generation
- 🪙 INFT operations
- 📦 Storage operations
- 🔐 Encryption operations

## 🔒 Security Considerations

### Data Protection

- All agent data is encrypted before storage
- Encryption keys are sealed for owner access
- Content metadata is encrypted
- 0G storage provides additional security layer

### Access Control

- Only agent owners can update their data
- INFT ownership controls content access
- API endpoints validate permissions

### Best Practices

- Use strong encryption keys
- Regularly rotate API keys
- Monitor for suspicious activity
- Keep dependencies updated

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript compilation
   - Verify all dependencies installed
   - Check import paths

2. **API Errors**
   - Verify server is running
   - Check environment variables
   - Review request format

3. **Contract Errors**
   - Verify network configuration
   - Check gas limits
   - Ensure contract is deployed

4. **Storage Errors**
   - Verify 0G storage credentials
   - Check network connectivity
   - Review storage limits

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run start:dev
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [0G Labs Documentation](https://docs.0glabs.com/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the demo scripts
3. Check the API documentation
4. Create an issue in the repository

---

**Note**: This is a development version. For production use, ensure all security measures are properly implemented and tested. 