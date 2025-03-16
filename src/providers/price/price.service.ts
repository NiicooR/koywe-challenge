import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PriceRateResponse } from './interfaces/price-rate.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      const apiUrl = this.configService.get<string>('cryptomkt.apiUrl');
      const url = `${apiUrl}?from=${from}&to=${to}`;

      const { data } = await firstValueFrom(
        this.httpService.get<PriceRateResponse>(url).pipe(
          catchError((error) => {
            this.logger.error(
              `Failed to fetch exchange rate: ${error.message}`,
            );
            throw new ServiceUnavailableException(
              'Failed to fetch exchange rate from external API',
            );
          }),
        ),
      );

      if (Object.keys(data).length === 0) {
        this.logger.error(`Empty response received for ${from} to ${to}`);
        throw new InternalServerErrorException(
          `Exchange rate conversion not supported for ${from} to ${to}`,
        );
      }

      if (!data[from]) {
        this.logger.error(
          `Missing rate information for ${from}: ${JSON.stringify(data)}`,
        );
        throw new InternalServerErrorException(
          `Exchange rate data not available for ${from}`,
        );
      }

      return parseFloat(data[from].price);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error(error.message);
      this.logger.warn('Using simulated exchange rate due to API failure');
      return this.getSimulatedRate(from, to);
    }
  }

  private getSimulatedRate(from: string, to: string): number {
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
