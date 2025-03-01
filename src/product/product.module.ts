import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { DomainModule } from './domain/domain.module';
import { UseCaseModule } from './use-case/usecase.module';


@Module({
  imports: [UseCaseModule, DomainModule],
  controllers: [ProductController],
  providers: [],
})
export class ProductModule {}
