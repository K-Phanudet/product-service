import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Product } from "../../domain/entities/product.entity";
import { ProductService } from "../../domain/services/product.service";
import { LogService } from "../../../logger/logger.service";


@Injectable()
export class CreateProductUseCase {
    constructor(
        private readonly productService: ProductService,
        private readonly logger: LogService,
    ) {
        this.logger.setClassName(CreateProductUseCase.name)
    }

    async execute(name: string, description: string): Promise<Product>{
        try {
            this.logger.debug("Creation product", { productName: name })
            return this.productService.create(name, description)
        }catch(error){
            this.logger.error("Failed to create product", { productName: name, error })
            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}