import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../repositories/product.repository";
import { PaginationData } from "../interfaces/pagination-data.interface";
import { Product } from "../entities/product.entity";

@Injectable()
export class ProductService {
    constructor(
        private readonly repository: ProductRepository
    ) { }

    async searchByName(
        name: string,
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginationData<Product>> {
        return this.repository.searchByName(name, page, limit);
    }

    async create(name: string, description: string): Promise<Product> {
        return this.repository.createProduct(name, description)
    }
}