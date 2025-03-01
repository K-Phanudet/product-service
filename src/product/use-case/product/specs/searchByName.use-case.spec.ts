import { Test, TestingModule } from '@nestjs/testing';
import { SearchByNameUseCase } from '../searchByName.use-case';
import { ProductService } from '../../../domain/services/product.service';
import { Product } from '../../../domain/entities/product.entity';
import { LogService } from '../../../../logger/logger.service';
import { PaginationData } from 'src/product/domain/interfaces/pagination-data.interface';


describe('SearchByNameUseCase', () => {
    let useCase: SearchByNameUseCase;
    let productService: ProductService;

    const productServiceMock = {
        searchByName: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchByNameUseCase,
                LogService,
                {
                    provide: ProductService,
                    useValue: productServiceMock,
                },
            ],
        }).compile();

        useCase = module.get<SearchByNameUseCase>(SearchByNameUseCase);
        productService = module.get<ProductService>(ProductService);
    });

    afterAll(() => {
        jest.restoreAllMocks()
    })

    const name = 'computer'
    const page = 1
    const limit = 15

    describe('GIVEN no error occurs', () => {

        describe('WHEN client requets to search list of products', () => {
            const respose: PaginationData<Product> = {
                data: [{
                    id: 1,
                    name: 'Test',
                    description: "Product test"
                }],
                page: page,
                perPage: limit,
                total: 50
            }

            beforeEach(() => {
                productServiceMock.searchByName.mockResolvedValue(respose)
            })

            afterEach(() => {
                jest.resetAllMocks()
            })

            it('THEN product service should have been call to search', async () => {
                await useCase.execute(name, page, limit)
                expect(productServiceMock.searchByName).toHaveBeenCalledWith(name, page, limit)
            })

            it('THEN should return list of product', async () => {
                const result = await useCase.execute(name, page, limit)
                expect(result.data).toEqual(respose.data)
                expect(result.page).toEqual(respose.page)
                expect(result.perPage).toEqual(respose.perPage)
                expect(result.total).toEqual(respose.total)
            })
        })


    })

    describe('GIVEN error occur', () => {
        describe('WHEN client requets to search list of products', () => {

            beforeEach(() => {
                productServiceMock.searchByName.mockRejectedValue(new Error('Failed to connect database'))
            })

            afterEach(() => {
                jest.resetAllMocks()
            })
            it('THEN should throw internal error', async () => {
                await expect(useCase.execute(name, page, limit)).rejects.toThrow();
            })

        });
    })

});
