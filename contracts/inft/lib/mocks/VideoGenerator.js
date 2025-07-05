class MockVideoGenerator {
    constructor() {
        this.generationCount = 0;
    }

    async generate(config) {
        this.generationCount++;
        
        // Simulate video generation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock video data
        const videoId = `video_${Date.now()}_${this.generationCount}`;
        
        return {
            id: videoId,
            url: `https://storage.0g.ai/videos/${videoId}.mp4`,
            thumbnail: `https://storage.0g.ai/thumbnails/${videoId}.jpg`,
            duration: config.duration || 60,
            resolution: config.resolution || '1080p',
            format: 'mp4',
            size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60MB
            metadata: {
                script: config.script,
                style: config.style,
                voice: config.voice,
                avatar: config.avatar,
                generatedAt: new Date().toISOString()
            },
            status: 'completed'
        };
    }

    async getGenerationStatus(videoId) {
        // Simulate checking generation status
        return {
            id: videoId,
            status: 'completed',
            progress: 100,
            estimatedTimeRemaining: 0
        };
    }

    async cancelGeneration(videoId) {
        return {
            id: videoId,
            status: 'cancelled',
            message: 'Generation cancelled successfully'
        };
    }
}

module.exports = MockVideoGenerator; 