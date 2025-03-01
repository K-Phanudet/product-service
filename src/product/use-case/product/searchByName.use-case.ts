import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Product } from "../../domain/entities/product.entity";
import { PaginationData } from "../../domain/interfaces/pagination-data.interface";
import { ProductService } from "../../domain/services/product.service";
import { LogService } from "../../../logger/logger.service";

@Injectable()
export class SearchByNameUseCase {
    constructor(
        private readonly productService: ProductService,
        private readonly logger: LogService,
    ) { 
        this.logger.setClassName(SearchByNameUseCase.name)
    }

    async execute(
        name: string,
        page: number = 1,
        limit: number = 10,): Promise<PaginationData<Product>> {
        try {
            this.logger.debug("Searching product", { productName: name })
            return this.productService.searchByName(name, page, limit)
        } catch (error) {
            this.logger.error("Failed to search", { error })
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}