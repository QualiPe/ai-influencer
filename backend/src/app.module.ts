import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { INFTModule } from './modules/INFTModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    INFTModule,
  ],
})
export class AppModule {} 