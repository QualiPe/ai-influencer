const { ethers } = require("ethers");
const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

// Official 0G AI service providers
const OFFICIAL_PROVIDERS = {
  "llama-3.3-70b-instruct": "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
  "deepseek-r1-70b": "0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3"
};

async function initializeBroker() {
  console.log("🔧 Initializing 0G Compute Network Broker...");
  
  // Get private key from .env and ensure it doesn't have 0x prefix
  let privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }
  
  // Remove 0x prefix if present
  if (privateKey.startsWith('0x')) {
    privateKey = privateKey.slice(2);
  }
  
  // Add 0x prefix for ethers.js
  const formattedPrivateKey = `0x${privateKey}`;
  
  const provider = new ethers.JsonRpcProvider("https://evmrpc-testnet.0g.ai");
  const wallet = new ethers.Wallet(formattedPrivateKey, provider);
  const broker = await createZGComputeNetworkBroker(wallet);
  
  console.log("✅ Broker initialized successfully");
  console.log("🔑 Wallet address:", wallet.address);
  return broker;
}

async function checkAndFundAccount(broker) {
  console.log("💰 Checking account balance...");

  try {
    const ledger = await broker.ledger.getLedger();
    let balance = "0";
    if (ledger && ledger.balance !== null && ledger.balance !== undefined) {
      balance = ethers.formatEther(ledger.balance);
    } else {
      console.log("⚠️ Ledger exists but balance is null/undefined. Treating as 0.");
    }
    console.log(`Current balance: ${balance} OG`);

    // If balance is less than 0.01 OG, add funds
    if (ledger && ledger.balance !== null && ledger.balance !== undefined && ledger.balance < ethers.parseEther("0.01")) {
      console.log("Adding funds to account...");
      await broker.ledger.addLedger(0.1);
      console.log("✅ Added 0.1 OG to account");
    }
  } catch (error) {
    if (error.message.includes("LedgerNotExists")) {
      console.log("📝 Creating new ledger account...");
      await broker.ledger.addLedger(0.1);
      console.log("✅ Created ledger with 0.1 OG initial funding");
      // Wait a moment for the transaction to be processed
      console.log("⏳ Waiting for transaction confirmation...");
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        const newLedger = await broker.ledger.getLedger();
        if (newLedger && newLedger.balance !== null && newLedger.balance !== undefined) {
          const newBalance = ethers.formatEther(newLedger.balance);
          console.log(`📊 New balance: ${newBalance} OG`);
        } else {
          console.log("📊 Ledger created successfully (balance check pending)");
        }
      } catch (balanceError) {
        console.log("📊 Ledger created successfully (balance check failed, but ledger exists)");
      }
    } else {
      throw error;
    }
  }
}

async function discoverServices(broker) {
  console.log("🔍 Discovering available AI services...");
  
  const services = await broker.inference.listService();
  console.log(`Found ${services.length} available services`);
  
  return services;
}

async function acknowledgeProvider(broker, providerAddress) {
  console.log(`🤝 Acknowledging provider: ${providerAddress}`);
  
  try {
    await broker.inference.acknowledgeProviderSigner(providerAddress);
    console.log("✅ Provider acknowledged successfully");
  } catch (error) {
    console.log("⚠️ Provider already acknowledged or error occurred:", error.message);
  }
}

async function generateContentWithAI(broker, prompt, contentType) {
  console.log(`🎯 Generating ${contentType} content...`);
  
  // Try providers in order of preference
  for (const [model, providerAddress] of Object.entries(OFFICIAL_PROVIDERS)) {
    try {
      console.log(`Trying ${model}...`);
      
      // Acknowledge provider
      await acknowledgeProvider(broker, providerAddress);
      
      // Get service metadata
      const { endpoint, model: modelName } = await broker.inference.getServiceMetadata(providerAddress);
      
      // Generate auth headers
      const headers = await broker.inference.getRequestHeaders(providerAddress, prompt);
      
      // Send request
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          ...headers 
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          model: modelName,
          max_tokens: 1000,
          temperature: 0.8
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      
      // Process response for verification (if applicable)
      try {
        const valid = await broker.inference.processResponse(providerAddress, generatedContent);
        if (valid !== undefined) {
          console.log(`Response verification: ${valid ? "Valid" : "Invalid"}`);
        }
      } catch (error) {
        console.log("Response verification not available for this provider");
      }
      
      console.log(`✅ Successfully generated ${contentType} using ${model}`);
      return generatedContent;
      
    } catch (error) {
      console.log(`❌ ${model} failed:`, error.message);
      continue; // Try next provider
    }
  }
  
  throw new Error("All providers failed to generate content");
}

async function getFirstTopicAndRemove() {
  try {
    const topicsPath = path.join(__dirname, "..", "topics.txt");
    const content = await fs.readFile(topicsPath, "utf8");
    const topics = content.split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (topics.length === 0) {
      throw new Error("No topics found in topics.txt");
    }
    
    const firstTopic = topics[0];
    const remainingTopics = topics.slice(1);
    
    // Write back the remaining topics
    await fs.writeFile(topicsPath, remainingTopics.join("\n") + "\n", "utf8");
    
    console.log(`📖 Using topic: "${firstTopic}"`);
    console.log(`📝 Remaining topics: ${remainingTopics.length}`);
    
    return firstTopic;
  } catch (error) {
    console.log("⚠️ Error reading topics.txt:", error.message);
    throw error;
  }
}

async function readMemoryFile(filename) {
  try {
    const filePath = path.join(__dirname, "..", filename);
    const content = await fs.readFile(filePath, "utf8");
    return content.trim();
  } catch (error) {
    console.log(`⚠️ ${filename} not found, using empty memory`);
    return "";
  }
}

async function saveToFile(content, filename) {
  try {
    const filePath = path.join(__dirname, "..", filename);
    await fs.writeFile(filePath, content, "utf8");
    console.log(`💾 Saved content to ${filename}`);
  } catch (error) {
    console.error(`❌ Error saving to ${filename}:`, error.message);
  }
}

async function main() {
  try {
    console.log("🚀 Starting AI Content Generation for Single Topic...\n");
    
    // Check if PRIVATE_KEY is set in .env
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in .env file. Please add PRIVATE_KEY=your_private_key_without_0x to .env");
    }
    
    // Initialize broker
    const broker = await initializeBroker();
    
    // Check and fund account
    await checkAndFundAccount(broker);
    
    // Discover services
    await discoverServices(broker);
    
    // Get first topic and remove it from the list
    const topic = await getFirstTopicAndRemove();
    
    // Read memory files
    const promptMemory = await readMemoryFile("prompt_memory.txt");
    const ttsMemory = await readMemoryFile("tts_memory.txt");
    
    console.log("");
    
    // Generate detailed video description
    console.log("🎬 Generating detailed video description...");
    const videoPrompt = `Topic: ${topic}

Create a detailed description (minimum 600 characters and max 1000 characters) for a 9-second video based on the topic above. The description should include:

1. Visual elements and scenes
2. Camera movements and angles
4. Color scheme and mood
5. Specific actions and transitions
6. Background music style
7. Target audience engagement elements
8. Without any text

Make it comprehensive and detailed enough for a video editor to create the exact video. Focus on viral-worthy, engaging content that would perform well on social media.`;
    
    const videoDescription = await generateContentWithAI(broker, videoPrompt, "video description");
    await saveToFile(videoDescription, "video_description.txt");
    console.log("");
    
    // Generate exact audio text
    console.log("🎵 Generating exact audio text...");
    const audioPrompt = `Topic: ${topic}

Create the exact text that will be spoken in a 8-second video based on the topic above. The text should:

1. Be exactly 7 seconds when spoken at normal pace
2. Include a hook at the beginning
3. Be optimized for voice-over delivery
4. Match the video description style
5. Be suitable for social media platforms
6. Short fact
7. Only two sentences

Write only the spoken text, no additional instructions or formatting.`;
    
    const audioText = await generateContentWithAI(broker, audioPrompt, "audio text");
    await saveToFile(audioText, "audio_text.txt");
    console.log("");
    
    // Display final results
    console.log("🎯 Generated Content:");
    console.log("📹 Video description saved to: video_description.txt");
    console.log("🎵 Audio text saved to: audio_text.txt");
    console.log("");
    console.log("📊 Content Summary:");
    console.log(`   Topic: ${topic}`);
    console.log(`   Video description length: ${videoDescription.length} characters`);
    console.log(`   Audio text length: ${audioText.length} characters`);
    console.log("");
    console.log("✅ Content generation completed successfully!");
    
  } catch (error) {
    console.error("❌ Content generation failed:", error);
    process.exit(1);
  }
}

// Run the script
main(); 