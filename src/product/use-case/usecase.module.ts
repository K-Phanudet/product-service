import { Module } from '@nestjs/common';

import { CreateProductUseCase } from './product/createProduct.use-case';
import { SearchByNameUseCase } from './product/searchByName.use-case';
import { DomainModule } from '../domain/domain.module';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [DomainModule, LoggerModule],
  controllers: [],
  providers: [CreateProductUseCase, SearchByNameUseCase],
  exports: [CreateProductUseCase, SearchByNameUseCase]
})
export class UseCaseModule {}
