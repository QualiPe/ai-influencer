# AI Influencer Backend with INFT Integration

This backend combines AI-powered video generation with INFT (Intelligent NFT) creation and 0G storage, creating a complete pipeline for AI influencers.

## 🚀 Features

- **AI Video Generation**: Uses GPT for prompts, Luma for video generation, and TTS for audio
- **Social Agent Creation**: Create and manage AI influencer personalities
- **INFT Minting**: Convert generated content into tradeable NFTs
- **0G Storage Integration**: Encrypted data storage on 0G network
- **REST API**: Complete API for managing the pipeline
- **Content Analysis**: Predict engagement and virality scores

## 📁 Project Structure

```
backend/
├── src/
│   ├── services/
│   │   └── INFTService.ts          # Main INFT service
│   ├── controllers/
│   │   └── INFTController.ts       # REST API endpoints
│   ├── modules/
│   │   └── INFTModule.ts           # NestJS module
│   ├── demo/
│   │   └── inft-pipeline-demo.ts   # Demo script
│   ├── ai/                         # AI services (GPT, Luma, TTS)
│   ├── media/                      # Media processing
│   ├── topics/                     # Topic generation
│   └── shared/                     # Generated content storage
├── app.module.ts                   # Main application module
├── main.ts                         # Application bootstrap
└── README_INFT.md                  # This file
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create shared directory:
```bash
mkdir -p shared
```

3. Set up environment variables in `.env`:
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
```

## 🚀 Usage

### 1. Start the Backend Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000`

### 2. API Endpoints

#### Create Social Agent
```bash
POST /inft/agent
Content-Type: application/json

{
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
  "ownerPublicKey": "0x1234567890abcdef..."
}
```

#### Generate Video Content
```bash
POST /inft/content
Content-Type: application/json

{
  "agentId": "agent_id_here",
  "topic": "The Future of AI in 2024",
  "customScript": "Optional custom script"
}
```

#### Mint Content as INFT
```bash
POST /inft/mint
Content-Type: application/json

{
  "recipient": "0xabcdef1234567890...",
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
}
```

#### Complete Pipeline
```bash
POST /inft/pipeline
Content-Type: application/json

{
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
  "ownerPublicKey": "0x1234567890abcdef..."
}
```

### 3. Run Demo Script

```bash
# Run the complete pipeline demo
npx ts-node src/demo/inft-pipeline-demo.ts
```

## 🔐 Security Features

- **Encrypted Storage**: All agent data and content metadata is encrypted before storage
- **Key Sealing**: Encryption keys are sealed for the owner's public key
- **0G Storage**: Decentralized, encrypted storage on 0G network
- **Content Hashing**: All content is hashed for integrity verification

## 🎬 Content Generation Pipeline

1. **Topic Selection**: Automatically selects trending topics
2. **Prompt Generation**: GPT creates engaging video scripts
3. **Video Generation**: Luma AI generates high-quality videos
4. **Audio Synthesis**: ElevenLabs creates natural voiceovers
5. **Content Analysis**: Predicts engagement and virality
6. **INFT Minting**: Converts content to tradeable NFTs
7. **Stats Update**: Updates agent performance metrics

## 📊 Data Flow

```
Topic → GPT Prompt → Luma Video → TTS Audio → Merge → Analysis → Encrypt → 0G Storage → INFT Mint
```

## 🔧 Configuration

### Social Agent Configuration
- **name**: Agent's display name
- **personality**: AI personality traits
- **niche**: Content category (tech, lifestyle, etc.)
- **targetAudience**: Target demographic
- **contentStyle**: Video style preferences
- **videoResolution**: Output video quality
- **videoDuration**: Target video length
- **aiModel**: GPT model version
- **voiceModel**: TTS service
- **avatarModel**: Avatar generation model

### Content Analysis
- **predictedViews**: Expected view count
- **predictedLikes**: Expected like count
- **predictedShares**: Expected share count
- **engagementRate**: Expected engagement percentage
- **viralityScore**: Content virality probability

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t ai-influencer-backend .

# Run the container
docker run -p 3000:3000 ai-influencer-backend
```

### Environment Variables
Make sure to set all required environment variables in your deployment environment.

## 🔗 Integration with Smart Contracts

The backend integrates with the INFT smart contracts located in `../contracts/inft/`:

- **INFT.sol**: Main INFT contract for minting
- **MetadataManager.sol**: Manages encrypted metadata
- **TransferManager.sol**: Handles INFT transfers

## 📈 Monitoring and Analytics

- **Agent Performance**: Track views, engagement, and revenue
- **Content Analytics**: Monitor virality and engagement predictions
- **INFT Trading**: Track NFT sales and transfers
- **Storage Usage**: Monitor 0G storage consumption

## 🛠️ Development

### Adding New AI Models
1. Create new service in `src/ai/`
2. Update `INFTService.ts` to use the new model
3. Add configuration options

### Extending Content Analysis
1. Modify the `mockContentAnalyzer` in `INFTService.ts`
2. Add new analysis metrics
3. Update the API response structure

### Custom Storage Providers
1. Implement storage interface
2. Replace `mockStorage` in `INFTService.ts`
3. Add configuration for new provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the demo scripts for examples
- Review the API documentation

---

**Note**: This is a development version. For production use, ensure all security measures are properly implemented and tested. 