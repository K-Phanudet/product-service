import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';

import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [],
  providers: [ProductService,ProductRepository],
  exports: [ProductService,ProductRepository]
})
export class DomainModule {}
