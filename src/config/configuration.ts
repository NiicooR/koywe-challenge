export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    jwt: {
      secret: process.env.JWT_SECRET || 'default_secret_key_for_development_only',
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    },
    cryptomkt: {
      apiUrl: process.env.CRYPTOMKT_API_URL || 'https://api.exchange.cryptomkt.com/api/3/public/price/rate',
    },
  });