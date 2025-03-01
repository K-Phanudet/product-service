
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { PaginationData } from '../interfaces/pagination-data.interface';
import { BaseRepository } from './base.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
    constructor(
        @InjectRepository(Product)
        repository: Repository<Product>,
    ) {
        super(repository, Product)
    }

    async createProduct(name: string, description: string): Promise<Product> {
        const product = this.repository.create({ name, description });
        return this.repository.save(product);
    }

    async searchByName(
        name: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginationData<Product>> {
        return this.findAllWithPagination({ name: Like(`%${name}%`)}, page, limit )
    }

    async getProduct(id: number): Promise<Product | null> {
        return this.repository.findOne({ where: { id } });
    }
}