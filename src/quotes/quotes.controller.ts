import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateQuoteDto, QuoteResponseDto } from './dto/quote.dto';
import { QuotesFacade } from './quotes.facade';

@Controller('quote')
@UseGuards(JwtAuthGuard)
export class QuotesController {
  constructor(private readonly quotesFacade: QuotesFacade) {}

  @Post()
  async createQuote(
    @Body() createQuoteDto: CreateQuoteDto,
  ): Promise<QuoteResponseDto> {
    return this.quotesFacade.createQuote(createQuoteDto);
  }

  @Get(':id')
  async getQuote(@Param('id') id: string): Promise<QuoteResponseDto> {
    return this.quotesFacade.getQuoteById(id);
  }
}
