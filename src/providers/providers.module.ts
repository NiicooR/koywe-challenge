import { Module } from '@nestjs/common';
import { PriceModule } from './price/price.module';

@Module({
  imports: [PriceModule],
  exports: [PriceModule],
})
export class ProvidersModule {}
