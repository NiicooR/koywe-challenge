import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    QuotesModule,
    ProvidersModule,
  ],
})
export class AppModule {}
