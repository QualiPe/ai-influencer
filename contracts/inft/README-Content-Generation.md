# AI Content Topic Generation with 0G Compute Network

This script uses the [0G Compute Network SDK](https://docs.0g.ai/developer-hub/building-on-0g/compute-network/sdk) to generate engaging content topics for AI influencers based on base topics.

## Features

- 🎬 **Video Content Topics**: Generates viral-worthy video content ideas
- 🎵 **Audio Content Topics**: Creates podcast-style audio content ideas
- 🤖 **AI-Powered**: Uses state-of-the-art LLMs (Llama 3.3 70B, DeepSeek R1 70B)
- 💰 **Automatic Billing**: Handles micropayments through 0G Compute Network
- 🔄 **Fallback System**: Tries multiple AI providers if one fails
- 📁 **File Management**: Automatically saves to `prompt_memory.txt` and `tts_memory.txt`

## Prerequisites

1. **0G Testnet Account**: You need a funded account on the 0G testnet
2. **Private Key**: Set your private key as an environment variable
3. **Dependencies**: Install required packages

## Installation

```bash
# Install dependencies
npm install @0glabs/0g-serving-broker @types/crypto-js@4.2.2 crypto-js@4.2.0 --legacy-peer-deps

# Set your private key
export PRIVATE_KEY="your_private_key_here"
```

## Usage

### 1. Prepare Base Topics

Create a `topics.txt` file in the project root with your base topics (one per line):

```txt
AI technology
Digital transformation
Future of work
Innovation
Tech trends
```

### 2. Run the Script

```bash
node scripts/generate-content-topics.js
```

### 3. Check Output Files

The script will generate two files:

- **`prompt_memory.txt`**: Video content topics
- **`tts_memory.txt`**: Audio content topics

## How It Works

1. **Initialization**: Connects to 0G Compute Network using your private key
2. **Account Check**: Verifies balance and adds funds if needed
3. **Service Discovery**: Finds available AI providers
4. **Content Generation**: 
   - Reads base topics from `topics.txt`
   - Generates video topics using AI
   - Generates audio topics using AI
5. **File Storage**: Saves results to respective memory files

## AI Providers Used

The script uses official 0G AI service providers:

| Model | Provider Address | Description |
|-------|------------------|-------------|
| **llama-3.3-70b-instruct** | `0xf07240Efa67755B5311bc75784a061eDB47165Dd` | State-of-the-art 70B parameter model |
| **deepseek-r1-70b** | `0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3` | Advanced reasoning model |

## Cost Estimation

- **Account Funding**: ~0.1 OG tokens (~10,000 requests)
- **Per Request**: Very low cost (micropayments)
- **Typical Usage**: 0.01-0.05 OG for content generation

## Example Output

### prompt_memory.txt (Video Topics)
```
1. AI Revolution: 5 Mind-Blowing Tech Breakthroughs
2. Future of Work: Robots Taking Our Jobs?
3. Blockchain Basics: Crypto for Beginners
4. Digital Transformation: Companies That Failed
5. Innovation Secrets: How Startups Disrupt
6. Tech Trends 2024: What's Next?
7. Machine Learning: AI That Learns Like Humans
8. Automation Nation: Jobs of Tomorrow
9. Web3 Explained: Internet's Next Chapter
10. Sustainability Tech: Green Innovation
```

### tts_memory.txt (Audio Topics)
```
1. The AI Revolution: How Technology is Changing Everything
2. Digital Transformation Stories: Success and Failure
3. Future of Work: Preparing for the Robot Economy
4. Innovation Secrets: Behind the Scenes of Tech Giants
5. Tech Trends Deep Dive: What's Really Happening
6. Blockchain Revolution: Beyond Cryptocurrency
7. Machine Learning Journey: From Theory to Reality
8. Automation Anxiety: Jobs, Skills, and Adaptation
9. Web3 Chronicles: Building the Decentralized Future
10. Sustainability Tech: Saving the Planet with Innovation
```

## Troubleshooting

### Common Issues

**Error: Insufficient balance**
```bash
# The script automatically adds funds, but you can manually add more:
await broker.ledger.addLedger(ethers.parseEther("0.1"));
```

**Error: Provider not responding**
- The script automatically tries multiple providers
- Check 0G network status if all providers fail

**Error: PRIVATE_KEY not set**
```bash
export PRIVATE_KEY="your_private_key_here"
```

### Getting 0G Testnet Tokens

1. Visit the 0G testnet faucet
2. Connect your wallet
3. Request testnet tokens
4. Use the private key in your script

## Integration with Telegram Bot

This script can be integrated with your AI influencer Telegram bot:

```javascript
// In your bot code
const videoTopics = await fs.readFile('prompt_memory.txt', 'utf8');
const audioTopics = await fs.readFile('tts_memory.txt', 'utf8');

// Use topics for content generation
const selectedTopic = videoTopics.split('\n')[Math.floor(Math.random() * 10)];
```

## Advanced Usage

### Custom Prompts

You can modify the prompts in the script to generate different types of content:

```javascript
// For different content styles
const prompt = `Generate 10 ${style} content topics about ${category}...`;
```

### Batch Processing

Run the script multiple times to generate more content:

```bash
# Generate content for different niches
echo "Gaming, Esports, Streaming" > topics.txt
node scripts/generate-content-topics.js

echo "Fitness, Health, Wellness" > topics.txt
node scripts/generate-content-topics.js
```

## Security Notes

- Never commit your private key to version control
- Use environment variables for sensitive data
- Keep your 0G account funded but don't over-fund
- Monitor your usage and costs

## Support

- [0G Documentation](https://docs.0g.ai/)
- [0G Discord](https://discord.gg/0g)
- [0G GitHub](https://github.com/0glabs) 