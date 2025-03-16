import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/database/prisma.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { PriceService } from '../../src/providers/price/price.service';

class MockJwtAuthGuard {
  canActivate() {
    return true;
  }
}

class MockPriceService {
  async getExchangeRate(from: string, to: string): Promise<number> {
    const rates = {
      ARS_ETH: 0.0000023,
      ETH_ARS: 2515123.5,
      ARS_BTC: 0.0000095,
      BTC_ARS: 105263.16,
      USD_ETH: 0.00046,
      ETH_USD: 2173.91,
      USD_BTC: 0.000019,
      BTC_USD: 52631.58,
    };

    const pair = `${from}_${to}`;
    return rates[pair] || 1.0;
  }
}

describe('Currency Exchange API (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let quoteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .overrideProvider(PriceService)
      .useClass(MockPriceService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    prismaService = app.get<PrismaService>(PrismaService);

    await prismaService.quote.deleteMany({});

    await app.init();
  });

  afterAll(async () => {
    await prismaService.quote.deleteMany({});
    await app.close();
  });

  describe('POST /quote', () => {
    it('should create a new quote with ARS to ETH conversion', async () => {
      const createQuoteDto = {
        amount: 1000000,
        from: 'ARS',
        to: 'ETH',
      };

      const response = await request(app.getHttpServer())
        .post('/quote')
        .send(createQuoteDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.from).toBe(createQuoteDto.from);
      expect(response.body.to).toBe(createQuoteDto.to);
      expect(response.body.amount).toBe(createQuoteDto.amount);
      expect(response.body).toHaveProperty('rate');
      expect(response.body).toHaveProperty('convertedAmount');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('expiresAt');

      quoteId = response.body.id;
    });

    it('should validate input data and reject negative amounts', async () => {
      const invalidQuoteDto = {
        amount: -1000,
        from: 'ARS',
        to: 'ETH',
      };

      const response = await request(app.getHttpServer())
        .post('/quote')
        .send(invalidQuoteDto)
        .expect(400);

      expect(response.body.message[0]).toContain(
        'amount must not be less than 0',
      );
    });

    it('should create a quote with ETH to ARS conversion', async () => {
      const createQuoteDto = {
        amount: 1,
        from: 'ETH',
        to: 'ARS',
      };

      const response = await request(app.getHttpServer())
        .post('/quote')
        .send(createQuoteDto)
        .expect(201);

      expect(response.body.from).toBe('ETH');
      expect(response.body.to).toBe('ARS');
      expect(response.body.amount).toBe(1);
      expect(parseFloat(response.body.convertedAmount)).toBeGreaterThan(0);
    });
  });

  describe('GET /quote/:id', () => {
    it('should retrieve a quote by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quote/${quoteId}`)
        .expect(200);

      expect(response.body.id).toBe(quoteId);
      expect(response.body).toHaveProperty('from', 'ARS');
      expect(response.body).toHaveProperty('to', 'ETH');
      expect(response.body).toHaveProperty('amount', 1000000);
    });

    it('should return 404 for non-existent quote ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer())
        .get(`/quote/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });
  });
});
