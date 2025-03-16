import { BadRequestException, Injectable } from '@nestjs/common';
import { Quote } from '@prisma/client';
import { CreateQuoteDto, QuoteResponseDto } from './dto/quote.dto';

@Injectable()
export class QuotesService {
  Q;
  constructor() {}

  calculateQuote(
    createQuoteDto: CreateQuoteDto,
    rate: number,
  ): {
    from: string;
    to: string;
    amount: number;
    rate: number;
    convertedAmount: number;
    timestamp: Date;
    expiresAt: Date;
  } {
    const { amount, from, to } = createQuoteDto;

    const convertedAmount = amount * rate;

    const timestamp = new Date();
    const expiresAt = new Date(timestamp);
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    return {
      from,
      to,
      amount,
      rate,
      convertedAmount,
      timestamp,
      expiresAt,
    };
  }

  isExpired(quote: Quote): boolean {
    const now = new Date();
    return now > quote.expiresAt;
  }

  mapToResponseDto(quote: Quote): QuoteResponseDto {
    return {
      id: quote.id,
      from: quote.from,
      to: quote.to,
      amount: quote.amount,
      rate: quote.rate,
      convertedAmount: quote.convertedAmount,
      timestamp: quote.timestamp.toISOString(),
      expiresAt: quote.expiresAt.toISOString(),
    };
  }
}
