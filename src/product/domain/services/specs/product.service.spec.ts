import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductService } from "../product.service";
import { PaginationData } from "../../interfaces/pagination-data.interface";
import { Product } from "../../entities/product.entity";

describe('ProductService', () => {
    let service: ProductService
    let productRepository: ProductRepository

    const repositoryMock = {
        createProduct: jest.fn(),
        searchByName: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: ProductRepository,
                    useValue: repositoryMock,
                },
            ]
        }).compile();

        service = module.get<ProductService>(ProductService)
        productRepository = module.get<ProductRepository>(ProductRepository)
    })

    afterAll(() => {
        jest.restoreAllMocks()
    })

    describe('GIVEN no errors occur', () => {
        describe('WHEN client call search By Name', () => {
            const name = "test"
            const page = 1
            const limit = 10

            beforeEach(() => {
                repositoryMock.searchByName.mockResolvedValue(jest.mocked<PaginationData<Product>>)
            })
            it('THEN should call repository to search product by name', async () => {
                await service.searchByName(name, page, limit)
                expect(repositoryMock.searchByName).toHaveBeenCalledWith(name, page, limit)
            })
        });

        describe("WHEN client request to create product", () => {
            const name = "test"
            const description = 'test description'


            beforeEach(() => {
                repositoryMock.createProduct.mockResolvedValue(jest.mocked<PaginationData<Product>>)
            })

            it('THEN should call repository to create product', async () => {
                await service.create(name, description)
                expect(repositoryMock.createProduct).toHaveBeenCalledWith(name, description)
            })
        })
    });
});