import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SaleProcessorModule } from './sale-processor/sale-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SaleProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
