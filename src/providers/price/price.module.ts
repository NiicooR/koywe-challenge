import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PriceService } from './price.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
