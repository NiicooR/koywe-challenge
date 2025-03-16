import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { PriceService } from '../../../src/providers/price/price.service';

describe('PriceService', () => {
  let service: PriceService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [PriceService],
    }).compile();

    service = module.get<PriceService>(PriceService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return exchange rate when API responds correctly', async () => {
    const from = 'BTC';
    const to = 'USD';
    const mockPrice = '52631.58';
    const expectedRate = 52631.58;

    const mockResponse = {
      data: {
        [from]: {
          price: mockPrice,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { url: '' } as any,
    };

    jest
      .spyOn(configService, 'get')
      .mockReturnValue('https://api.example.com/prices');

    jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

    const result = await service.getExchangeRate(from, to);

    expect(result).toBe(expectedRate);
    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.example.com/prices?from=BTC&to=USD',
    );
    expect(configService.get).toHaveBeenCalledWith('cryptomkt.apiUrl');
  });
});
