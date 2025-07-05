import { Module } from '@nestjs/common';
import { INFTService } from '../services/INFTService';
import { INFTController } from '../controllers/INFTController';

@Module({
  controllers: [INFTController],
  providers: [INFTService],
  exports: [INFTService]
})
export class INFTModule {} 