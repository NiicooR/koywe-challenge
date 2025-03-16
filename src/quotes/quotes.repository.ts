import { Injectable, NotFoundException } from '@nestjs/common';
import { Quote } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class QuotesRepository {
  constructor(private prisma: PrismaService) {}

  async create(quoteData: {
    from: string;
    to: string;
    amount: number;
    rate: number;
    convertedAmount: number;
    timestamp: Date;
    expiresAt: Date;
  }): Promise<Quote> {
    const quote = await this.prisma.quote.findFirst({
      where: {
        from: quoteData.from,
        to: quoteData.to,
        amount: quoteData.amount,
      },
    });
    if (quote) {
      return quote;
    }
    return this.prisma.quote.create({
      data: quoteData,
    });
  }

  async findById(id: string): Promise<Quote> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    return quote;
  }
}
