export interface PriceRateResponse {
  [key: string]: {
    currency: string;
    price: string;
    timestamp: string;
  };
}
