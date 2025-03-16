import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateQuoteDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}

export class QuoteResponseDto {
  id: string;
  from: string;
  to: string;
  amount: number;
  rate: number;
  convertedAmount: number;
  timestamp: string;
  expiresAt: string;
}
