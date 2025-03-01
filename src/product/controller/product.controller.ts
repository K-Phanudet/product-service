import { Controller, Get, Query, Post, Body, ParseIntPipe } from '@nestjs/common';
import { CreateProductUseCase } from '../use-case/product/createProduct.use-case';
import { CreateProductDto } from '../dto/createProduct.dto';
import { Product } from '../domain/entities/product.entity';
import { SearchByNameUseCase } from '../use-case/product/searchByName.use-case';
import { PaginationData } from '../domain/interfaces/pagination-data.interface';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly searchByNameUseCase: SearchByNameUseCase
  ) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.execute(createProductDto.name, createProductDto.description)
  }

  @Get('/search')
  @ApiQuery({ name: 'name', required: true, })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async search(
    @Query('name') name: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ): Promise<PaginationData<Product>> {
    return this.searchByNameUseCase.execute(name, page, limit);
  }
}