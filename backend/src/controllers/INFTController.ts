import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { INFTService, SocialAgentConfig, VideoContent, AgentStats } from '../services/INFTService';

export class CreateAgentDto {
  config: SocialAgentConfig;
  ownerPublicKey: string;
}

export class GenerateContentDto {
  agentId: string;
  topic?: string;
  customScript?: string;
}

export class MintINFTDto {
  recipient: string;
  videoContent: VideoContent;
}

export class UpdateStatsDto {
  agentId: string;
  stats: Partial<AgentStats>;
}

@Controller('inft')
export class INFTController {
  constructor(private readonly inftService: INFTService) {}

  @Post('agent')
  async createSocialAgent(@Body() createAgentDto: CreateAgentDto) {
    try {
      const result = await this.inftService.createSocialAgent(
        createAgentDto.config,
        createAgentDto.ownerPublicKey
      );
      
      return {
        success: true,
        data: result,
        message: 'Social agent created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create social agent'
      };
    }
  }

  @Post('content')
  async generateVideoContent(@Body() generateContentDto: GenerateContentDto) {
    try {
      const result = await this.inftService.generateVideoContent(
        generateContentDto.agentId,
        generateContentDto.topic || 'AI and Technology',
        generateContentDto.customScript
      );
      
      return {
        success: true,
        data: result,
        message: 'Video content generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate video content'
      };
    }
  }

  @Post('mint')
  async mintContentAsINFT(@Body() mintDto: MintINFTDto) {
    try {
      const result = await this.inftService.mintContentAsINFT(
        mintDto.recipient,
        mintDto.videoContent
      );
      
      return {
        success: true,
        data: result,
        message: 'Content minted as INFT successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to mint content as INFT'
      };
    }
  }

  @Put('stats')
  async updateAgentStats(@Body() updateStatsDto: UpdateStatsDto) {
    try {
      const result = await this.inftService.updateAgentStats(
        updateStatsDto.agentId,
        updateStatsDto.stats
      );
      
      return {
        success: true,
        data: result,
        message: 'Agent stats updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update agent stats'
      };
    }
  }

  @Post('pipeline')
  async generateContentWithINFT(@Body() createAgentDto: CreateAgentDto) {
    try {
      // Mock contract for the complete pipeline
      const mockContract = {
        mint: async (recipient: string, uri: string, hash: string) => {
          console.log("📋 Minting INFT in pipeline...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return {
            wait: async () => {
              return {
                events: [{
                  args: {
                    tokenId: Math.floor(Math.random() * 1000) + 1
                  }
                }],
                transactionHash: "0x" + Math.random().toString(16).substring(2, 42)
              };
            }
          };
        }
      };

      const result = await this.inftService.generateContentWithINFT(
        createAgentDto.config,
        createAgentDto.ownerPublicKey,
        createAgentDto.ownerPublicKey // Using owner as recipient for demo
      );
      
      return {
        success: true,
        data: result,
        message: 'Complete pipeline executed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to execute complete pipeline'
      };
    }
  }

  @Get('health')
  async healthCheck() {
    return {
      success: true,
      message: 'INFT service is running',
      timestamp: new Date().toISOString()
    };
  }
} 