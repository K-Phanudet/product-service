import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './config/database.config';

@Module({
  imports: [
    ProductModule, 
    LoggerModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    
  ],
})
export class AppModule {}
