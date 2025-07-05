const axios = require('axios');

const BASE_URL = 'http://localhost:3000/inft';

async function testINFTApi() {
  console.log('🧪 Testing INFT API endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Create Social Agent
    console.log('2️⃣ Testing social agent creation...');
    const agentConfig = {
      name: "TestAgent",
      personality: "Friendly tech enthusiast",
      niche: "tech",
      targetAudience: "developers",
      contentStyle: "Educational",
      videoResolution: "1080p",
      videoDuration: 60,
      videoStyle: "modern",
      aiModel: "gpt-4",
      voiceModel: "elevenlabs",
      avatarModel: "stable-diffusion"
    };

    const createAgentResponse = await axios.post(`${BASE_URL}/agent`, {
      config: agentConfig,
      ownerPublicKey: "0x1234567890abcdef1234567890abcdef12345678"
    });

    console.log('✅ Agent created:', createAgentResponse.data.success);
    console.log('🆔 Agent ID:', createAgentResponse.data.data.agentId.substring(0, 20) + '...');
    console.log('');

    // Test 3: Generate Content (Mock)
    console.log('3️⃣ Testing content generation...');
    const contentResponse = await axios.post(`${BASE_URL}/content`, {
      agentId: createAgentResponse.data.data.agentId,
      topic: "Testing AI Integration"
    });

    console.log('✅ Content generated:', contentResponse.data.success);
    console.log('🎥 Video URL:', contentResponse.data.data.videoUrl);
    console.log('📊 Predicted Views:', contentResponse.data.data.analysis.predictedViews);
    console.log('');

    // Test 4: Mint INFT
    console.log('4️⃣ Testing INFT minting...');
    const mintResponse = await axios.post(`${BASE_URL}/mint`, {
      recipient: "0xabcdef1234567890abcdef1234567890abcdef12",
      videoContent: contentResponse.data.data
    });

    console.log('✅ INFT minted:', mintResponse.data.success);
    console.log('🆔 Token ID:', mintResponse.data.data.tokenId);
    console.log('🔗 Transaction Hash:', mintResponse.data.data.transactionHash);
    console.log('');

    // Test 5: Update Stats
    console.log('5️⃣ Testing stats update...');
    const statsResponse = await axios.put(`${BASE_URL}/stats`, {
      agentId: createAgentResponse.data.data.agentId,
      stats: {
        videosCreated: 1,
        totalViews: 50000,
        engagementRate: 0.05
      }
    });

    console.log('✅ Stats updated:', statsResponse.data.success);
    console.log('📈 New URI:', statsResponse.data.data.updatedURI);
    console.log('');

    // Test 6: Complete Pipeline
    console.log('6️⃣ Testing complete pipeline...');
    const pipelineResponse = await axios.post(`${BASE_URL}/pipeline`, {
      config: agentConfig,
      ownerPublicKey: "0x1234567890abcdef1234567890abcdef12345678"
    });

    console.log('✅ Pipeline completed:', pipelineResponse.data.success);
    console.log('🤖 Agent:', pipelineResponse.data.data.agent.agentId.substring(0, 20) + '...');
    console.log('🎬 Content:', pipelineResponse.data.data.content.videoUrl);
    console.log('🪙 INFT Token ID:', pipelineResponse.data.data.inft.tokenId);
    console.log('');

    console.log('🎉 All API tests passed successfully!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('   ✅ Health check');
    console.log('   ✅ Social agent creation');
    console.log('   ✅ Content generation');
    console.log('   ✅ INFT minting');
    console.log('   ✅ Stats update');
    console.log('   ✅ Complete pipeline');
    console.log('');
    console.log('🚀 Your INFT backend is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
testINFTApi(); 