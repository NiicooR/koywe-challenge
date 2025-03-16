import { Test, TestingModule } from '@nestjs/testing';
import { QuotesFacade } from '../../../src/quotes/quotes.facade';
import { QuotesService } from '../../../src/quotes/quotes.service';
import { QuotesRepository } from '../../../src/quotes/quotes.repository';
import { PriceService } from '../../../src/providers/price/price.service';
import { CreateQuoteDto } from '../../../src/quotes/dto/quote.dto';

describe('QuotesFacade', () => {
  let quotesFacade: QuotesFacade;
  let quotesService: QuotesService;
  let quotesRepository: QuotesRepository;
  let priceService: PriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotesFacade,
        {
          provide: QuotesService,
          useValue: {
            calculateQuote: jest.fn(),
            mapToResponseDto: jest.fn(),
            isExpired: jest.fn(),
          },
        },
        {
          provide: QuotesRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: PriceService,
          useValue: {
            getExchangeRate: jest.fn(),
          },
        },
      ],
    }).compile();

    quotesFacade = module.get<QuotesFacade>(QuotesFacade);
    quotesService = module.get<QuotesService>(QuotesService);
    quotesRepository = module.get<QuotesRepository>(QuotesRepository);
    priceService = module.get<PriceService>(PriceService);
  });

  describe('createQuote', () => {
    it('should create and return a quote', async () => {
      // Arrange
      const createQuoteDto: CreateQuoteDto = {
        amount: 1000000,
        from: 'ARS',
        to: 'ETH',
      };

      const rate = 0.0000023;

      const quoteData = {
        from: 'ARS',
        to: 'ETH',
        amount: 1000000,
        rate: rate,
        convertedAmount: 2.3,
        timestamp: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes in the future
      };

      const savedQuote = {
        id: 'quote-123',
        ...quoteData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResponse = {
        id: 'quote-123',
        from: 'ARS',
        to: 'ETH',
        amount: 1000000,
        rate: rate,
        convertedAmount: 2.3,
        timestamp: savedQuote.timestamp.toISOString(),
        expiresAt: savedQuote.expiresAt.toISOString(),
      };

      jest.spyOn(priceService, 'getExchangeRate').mockResolvedValue(rate);
      jest.spyOn(quotesService, 'calculateQuote').mockReturnValue(quoteData);
      jest.spyOn(quotesRepository, 'create').mockResolvedValue(savedQuote);
      jest
        .spyOn(quotesService, 'mapToResponseDto')
        .mockReturnValue(expectedResponse);

      const result = await quotesFacade.createQuote(createQuoteDto);

      expect(priceService.getExchangeRate).toHaveBeenCalledWith('ARS', 'ETH');
      expect(quotesService.calculateQuote).toHaveBeenCalledWith(
        createQuoteDto,
        rate,
      );
      expect(quotesRepository.create).toHaveBeenCalledWith(quoteData);
      expect(quotesService.mapToResponseDto).toHaveBeenCalledWith(savedQuote);
      expect(result).toEqual(expectedResponse);
    });
  });
});
