import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductUseCase } from '../createProduct.use-case';
import { ProductService } from '../../../domain/services/product.service';
import { Product } from '../../../domain/entities/product.entity';
import { LogService } from '../../../../logger/logger.service';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productService: ProductService;

  const productServiceMock = {
    create: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductUseCase,
        LogService,
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compile();

    useCase = module.get<CreateProductUseCase>(CreateProductUseCase);
    productService = module.get<ProductService>(ProductService);
  });

  afterAll(() => {
    jest.restoreAllMocks()
  })

  const name = 'Product 1'
  const description = 'Description for product 1'
  describe('GIVEN no error occurs', () => {


    const createdProduct: Product = { id: 1, name, description }

    describe('WHEN client requets to create product', () => {
      beforeEach(() => {
        productServiceMock.create.mockResolvedValue(createdProduct)
      })

      afterEach(() => {
        jest.resetAllMocks()
      })

      it('THEN product service should have been call to create', async () => {
        await useCase.execute(name, description)
        expect(productServiceMock.create).toHaveBeenCalledWith(name, description)
      })

      it('THEN should return product information', async () => {
        const productResponse = await useCase.execute(name, description)

        expect(productResponse.name).toEqual(name)
        expect(productResponse.description).toEqual(description)
      })
    })
  })

  describe('GIVEN error occur', () => {
    describe("WHEN client requets to create product", () => {

      beforeEach(() => {
        productServiceMock.create.mockRejectedValue(new Error('Product creation failed'));
      })

      afterEach(() => {
        jest.resetAllMocks()
      })

      it('THEN should throw internal error', async () => {
        await expect(useCase.execute(name, description)).rejects.toThrow('Product creation failed');
      })

    })
  })
});
