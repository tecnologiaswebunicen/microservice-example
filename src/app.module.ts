import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SaleProcessorModule } from './sale-processor/sale-processor.module';

@Module({
  imports: [SaleProcessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
