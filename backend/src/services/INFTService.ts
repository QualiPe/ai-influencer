import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { ethers } from 'ethers';
import { getNextTopic } from '../topics/utils';
import { generatePrompt, generateTTS } from '../ai/gpt';
import { generateVideo } from '../ai/luma';
import { generateTTS as synthTTS } from '../ai/tts';
import { mergeAV } from '../media/merge';

// Import INFT ABI
const INFT_ABI = require('../abi/INFT.json');

export interface SocialAgentConfig {
  name: string;
  personality: string;
  niche: string;
  targetAudience: string;
  contentStyle: string;
  videoResolution: string;
  videoDuration: number;
  videoStyle: string;
  aiModel: string;
  voiceModel: string;
  avatarModel: string;
}

export interface VideoContent {
  videoUrl: string;
  thumbnailUrl: string;
  script: string;
  topic: string;
  analysis: {
    predictedViews: number;
    predictedLikes: number;
    predictedShares: number;
    engagementRate: number;
    viralityScore: number;
  };
}

export interface AgentStats {
  videosCreated: number;
  totalViews: number;
  engagementRate: number;
  followers: number;
  revenue: number;
}

@Injectable()
export class INFTService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private inftContract: ethers.Contract;

  constructor() {
    // Initialize blockchain connection
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    
    // Initialize INFT contract
    this.inftContract = new ethers.Contract(
      process.env.INFT_CONTRACT_ADDRESS!,
      INFT_ABI.abi,
      this.wallet
    );

    console.log("🔗 Connected to INFT contract:", process.env.INFT_CONTRACT_ADDRESS);
    console.log("👤 Using wallet:", this.wallet.address);
  }

  private mockStorage = {
    store: async (data: any) => {
      console.log("📦 Storing encrypted data on 0G Storage...");
      await new Promise(resolve => setTimeout(resolve, 100));
      return { uri: `ipfs://Qm${Date.now()}` };
    }
  };

  private mockEncryption = {
    encrypt: async (data: any, key: string) => {
      console.log("🔐 Encrypting data...");
      return Buffer.from(JSON.stringify(data)).toString('base64');
    },
    sealKey: async (key: string, publicKey: string) => {
      console.log("🔒 Sealing key for owner...");
      return Buffer.from(key).toString('base64');
    }
  };

  private mockContentAnalyzer = {
    analyzeContent: async (script: string, topic: string) => {
      console.log("📊 Analyzing content...");
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return {
        predictedViews: Math.floor(Math.random() * 100000) + 1000,
        predictedLikes: Math.floor(Math.random() * 10000) + 100,
        predictedShares: Math.floor(Math.random() * 1000) + 10,
        engagementRate: Math.random() * 0.1 + 0.02,
        viralityScore: Math.random() * 0.3 + 0.1
      };
    }
  };

  async createSocialAgent(config: SocialAgentConfig, ownerPublicKey: string) {
    console.log("🤖 Creating Social Agent:", config.name);

    const agentData = {
      ...config,
      createdAt: new Date().toISOString(),
      stats: {
        videosCreated: 0,
        totalViews: 0,
        engagementRate: 0,
        followers: 0,
        revenue: 0
      }
    };

    // Encrypt agent data
    const encryptionKey = ethers.hexlify(ethers.randomBytes(32));
    const encryptedData = await this.mockEncryption.encrypt(agentData, encryptionKey);
    const sealedKey = await this.mockEncryption.sealKey(encryptionKey, ownerPublicKey);

    // Store on 0G Storage
    const storageResult = await this.mockStorage.store(encryptedData);

    return {
      agentId: ethers.id(JSON.stringify(agentData) + Date.now()),
      encryptedURI: storageResult.uri,
      sealedKey: sealedKey,
      config: config
    };
  }

  async generateVideoContent(agentId: string, topic: string, customScript?: string): Promise<VideoContent> {
    console.log("🎬 Generating video content for topic:", topic);

    // Generate prompt using existing AI service
    const prompt = customScript || await generatePrompt(topic);
    console.log("📝 Generated prompt:", prompt.substring(0, 100) + "...");

    // Generate video using existing Luma service
    const videoFileName = `${topic.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.mp4`;
    const vidPath = path.resolve('shared', videoFileName);
    await generateVideo(prompt, vidPath);

    // Generate TTS
    const ttsText = await generateTTS(prompt);
    const ttsFileName = `${topic.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.wav`;
    const ttsPath = path.resolve('shared', ttsFileName);
    await synthTTS(ttsText, ttsPath);

    // Merge audio and video
    const finalFileName = `${topic.replace(/[^a-z0-9]/gi, '_')}_final_${Date.now()}.mp4`;
    const outFile = path.resolve('shared', finalFileName);
    await mergeAV(vidPath, ttsPath, outFile);

    // Analyze content
    const analysis = await this.mockContentAnalyzer.analyzeContent(prompt, topic);

    return {
      videoUrl: outFile,
      thumbnailUrl: outFile.replace('.mp4', '_thumb.jpg'),
      script: prompt,
      topic: topic,
      analysis: analysis
    };
  }

  async mintContentAsINFT(recipient: string, videoContent: VideoContent) {
    console.log("🪙 Minting content as INFT using real contract...");

    // Prepare metadata for INFT
    const metadata = {
      name: `AI Generated Video: ${videoContent.topic}`,
      description: videoContent.script.substring(0, 200) + "...",
      image: videoContent.thumbnailUrl,
      animation_url: videoContent.videoUrl,
      attributes: [
        {
          trait_type: "Topic",
          value: videoContent.topic
        },
        {
          trait_type: "Predicted Views",
          value: videoContent.analysis.predictedViews
        },
        {
          trait_type: "Virality Score",
          value: (videoContent.analysis.viralityScore * 100).toFixed(1) + "%"
        }
      ],
      properties: {
        files: [
          {
            type: "video/mp4",
            uri: videoContent.videoUrl
          }
        ]
      }
    };

    // Encrypt metadata
    const encryptionKey = ethers.hexlify(ethers.randomBytes(32));
    const encryptedMetadata = await this.mockEncryption.encrypt(metadata, encryptionKey);
    
    // Store on 0G Storage
    const storageResult = await this.mockStorage.store(encryptedMetadata);
    
    // Calculate content hash
    const contentHash = ethers.id(JSON.stringify(metadata) + Date.now());

    try {
      // Mint INFT using real contract
      console.log("📋 Calling real INFT contract...");
      console.log("👤 Recipient:", recipient);
      console.log("🔗 URI:", storageResult.uri);
      console.log("🔍 Hash:", contentHash);
      
      const tx = await this.inftContract.createAgent(
        metadata.name,
        metadata.description
      );
      
      console.log("⏳ Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      
      console.log("✅ Transaction confirmed!");
      console.log("🔗 Transaction hash:", receipt.hash);
      console.log("📊 Gas used:", receipt.gasUsed.toString());
      console.log("📦 Block number:", receipt.blockNumber);

      // Get the token ID from the event
      const event = receipt.logs.find((log: any) => 
        log.topics[0] === ethers.id("AgentCreated(uint256,string,address)")
      );
      
      let tokenId = "1"; // Default fallback
      if (event) {
        // Parse the event to get token ID
        const decoded = this.inftContract.interface.parseLog(event);
        if (decoded) {
          tokenId = decoded.args[0].toString();
        }
      }

      return {
        tokenId: tokenId,
        contentId: ethers.id(JSON.stringify(videoContent) + Date.now()),
        transactionHash: receipt.hash,
        metadata: metadata,
        encryptedURI: storageResult.uri,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };

    } catch (error) {
      console.error("❌ Contract interaction failed:", error);
      throw new Error(`Failed to mint INFT: ${error.message}`);
    }
  }

  async updateAgentStats(agentId: string, newStats: Partial<AgentStats>) {
    console.log("📊 Updating agent stats...");

    // In a real implementation, you would:
    // 1. Retrieve the current agent data from 0G storage
    // 2. Decrypt it using the owner's key
    // 3. Update the stats
    // 4. Re-encrypt and store

    const updatedStats = {
      videosCreated: newStats.videosCreated || 0,
      totalViews: newStats.totalViews || 0,
      engagementRate: newStats.engagementRate || 0,
      followers: newStats.followers || 0,
      revenue: newStats.revenue || 0
    };

    // Mock storage update
    const storageResult = await this.mockStorage.store(updatedStats);
    const newSealedKey = await this.mockEncryption.sealKey("new-key", "owner-public-key");

    return {
      updatedURI: storageResult.uri,
      newSealedKey: newSealedKey,
      stats: updatedStats
    };
  }

  async generateContentWithINFT(agentConfig: SocialAgentConfig, ownerPublicKey: string, recipient: string) {
    console.log("🚀 Starting complete content generation with INFT pipeline...");

    try {
      // Step 1: Create Social Agent
      const socialAgent = await this.createSocialAgent(agentConfig, ownerPublicKey);
      console.log("✅ Social Agent created:", socialAgent.agentId.substring(0, 20) + "...");

      // Step 2: Get next topic and generate content
      const topic = await getNextTopic();
      if (!topic) {
        throw new Error('No topics available for generation');
      }

      const videoContent = await this.generateVideoContent(socialAgent.agentId, topic);
      console.log("✅ Video content generated:", videoContent.videoUrl);

      // Step 3: Mint as INFT using real contract
      const mintResult = await this.mintContentAsINFT(recipient, videoContent);
      console.log("✅ Content minted as INFT:", mintResult.tokenId);

      // Step 4: Update agent stats
      const statsUpdate = await this.updateAgentStats(socialAgent.agentId, {
        videosCreated: 1,
        totalViews: videoContent.analysis.predictedViews,
        engagementRate: videoContent.analysis.engagementRate
      });

      return {
        agent: socialAgent,
        content: videoContent,
        inft: mintResult,
        stats: statsUpdate.stats
      };

    } catch (error) {
      console.error("❌ Error in content generation pipeline:", error);
      throw error;
    }
  }
} 