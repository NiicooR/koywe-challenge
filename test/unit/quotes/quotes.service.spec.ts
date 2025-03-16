import { Test, TestingModule } from '@nestjs/testing';
import { QuotesService } from '../../../src/quotes/quotes.service';

describe('QuotesService', () => {
  let quotesService: QuotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuotesService],
    }).compile();

    quotesService = module.get<QuotesService>(QuotesService);
  });

  describe('calculateQuote', () => {
    it('should correctly calculate a quote with provided rate', () => {
      // Arrange
      const createQuoteDto = {
        amount: 1000000,
        from: 'ARS',
        to: 'ETH',
      };
      const rate = 0.0000023;

      const beforeTest = new Date();

      const result = quotesService.calculateQuote(createQuoteDto, rate);

      const afterTest = new Date();

      expect(result.from).toBe(createQuoteDto.from);
      expect(result.to).toBe(createQuoteDto.to);
      expect(result.amount).toBe(createQuoteDto.amount);
      expect(result.rate).toBe(rate);

      expect(result.convertedAmount).toBe(createQuoteDto.amount * rate);

      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTest.getTime(),
      );
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(
        afterTest.getTime(),
      );

      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(
        result.expiresAt.getTime() - result.timestamp.getTime(),
      ).toBeCloseTo(5 * 60 * 1000, -2);
    });
  });
});
