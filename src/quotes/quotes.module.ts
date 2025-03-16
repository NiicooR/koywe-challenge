import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { QuotesFacade } from './quotes.facade';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [QuotesController],
  providers: [QuotesService, QuotesRepository, QuotesFacade],
  exports: [QuotesService, QuotesRepository],
})
export class QuotesModule {}
