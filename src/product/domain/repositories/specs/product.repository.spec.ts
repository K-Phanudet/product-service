import { Repository } from "typeorm";
import { ProductRepository } from "../product.repository";
import { Product } from "../../entities/product.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BaseRepository } from "../base.repository";

describe('ProductRepository', () => {
    let productRepository: ProductRepository;
    let repositoryMock: jest.Mocked<Repository<Product>>

    beforeEach(async () => {
        repositoryMock = {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
        } as unknown as jest.Mocked<Repository<Product>>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductRepository,
                { provide: getRepositoryToken(Product), useValue: repositoryMock },
            ],
        }).compile();

        productRepository = module.get<ProductRepository>(ProductRepository);
    });

    describe('GIVEN no errors occur', () => {
        describe('WHEN client request to createProduct', () => {
            const name = 'Test Product';
            const description = 'Test Description';
            const product = { id: 1, name, description } as Product;

            beforeEach(() => {
                repositoryMock.create.mockReturnValue(product);
            })

            it('THEN should create product', async () => {
                await productRepository.createProduct(name, description);
                expect(repositoryMock.create).toHaveBeenCalledWith({ name, description });
            })
            it('THEN should save product', async () => {
                await productRepository.createProduct(name, description);
                expect(repositoryMock.save).toHaveBeenCalledWith(product);

            })
        })

        describe('WHEN client request to search by name', () => {

            const page = 1;
            const limit = 10;
            const name = 'Test';
            const mockData = [{ id: 1, name: 'Test Product', description: 'Test' }];
            const mockPaginationData = { data: mockData, total: 1, page, perPage: limit };


            beforeEach(() => {
                jest.spyOn(BaseRepository.prototype, 'findAllWithPagination').mockResolvedValue(mockPaginationData);
            })
            it('THEN should call findAllWithPagination with correct filters', async () => {
                await productRepository.searchByName(name, page, limit);

                expect(BaseRepository.prototype.findAllWithPagination).toHaveBeenCalledWith(
                    { name: expect.any(Object) },
                    page,
                    limit
                );
            })
        });
    });


});