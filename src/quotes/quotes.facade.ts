import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateQuoteDto, QuoteResponseDto } from './dto/quote.dto';
import { QuotesService } from './quotes.service';
import { QuotesRepository } from './quotes.repository';
import { PriceService } from '../providers/price/price.service';

@Injectable()
export class QuotesFacade {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly quotesRepository: QuotesRepository,
    private readonly priceService: PriceService,
  ) {}

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<QuoteResponseDto> {
    const rate = await this.priceService.getExchangeRate(
      createQuoteDto.from,
      createQuoteDto.to,
    );

    const quoteData = this.quotesService.calculateQuote(createQuoteDto, rate);

    const savedQuote = await this.quotesRepository.create(quoteData);

    return this.quotesService.mapToResponseDto(savedQuote);
  }

  async getQuoteById(id: string): Promise<QuoteResponseDto> {
    const quote = await this.quotesRepository.findById(id);

    if (this.quotesService.isExpired(quote)) {
      throw new NotFoundException(`Quote with ID ${id} has expired`);
    }

    return this.quotesService.mapToResponseDto(quote);
  }
}
