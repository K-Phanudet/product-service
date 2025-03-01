import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateProductUseCase } from '../../use-case/product/createProduct.use-case';
import { SearchByNameUseCase } from '../../use-case/product/searchByName.use-case';
import { ProductController } from '../product.controller';
import { CreateProductDto } from '../../dto/createProduct.dto';
import { Product } from '../../domain/entities/product.entity';
import { PaginationData } from '../../domain/interfaces/pagination-data.interface';
import { LogService } from '../../../logger/logger.service';

describe('[e2e] ProductController ', () => {
    let app: INestApplication;
    let createProductUseCaseMock: jest.Mocked<CreateProductUseCase>;
    let searchByNameUseCaseMock: jest.Mocked<SearchByNameUseCase>;

    beforeAll(async () => {
        createProductUseCaseMock = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<CreateProductUseCase>;

        searchByNameUseCaseMock = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<SearchByNameUseCase>;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                { provide: CreateProductUseCase, useValue: createProductUseCaseMock },
                { provide: SearchByNameUseCase, useValue: searchByNameUseCaseMock },
                LogService
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        jest.restoreAllMocks()
    });

    describe('GIVEN a successful scenario', () => {

        describe('WHEN a POST request is sent to /product', () => {
            const dto: CreateProductDto = { name: 'Test Product', description: 'Test Description' };
            const createdProduct: Product = { id: 1, name: dto.name, description: dto.description } as Product;
            let response
            beforeEach(async () => {
                createProductUseCaseMock.execute.mockResolvedValue(createdProduct);
                response = await request(app.getHttpServer())
                    .post('/product')
                    .send(dto)
            })

            afterEach(()=>{
                jest.resetAllMocks()
            })

            it('THEN should response with http created code', async () => {
                expect(response.status).toBe(HttpStatus.CREATED);
            })

            it('THEN should response created product', async () => {
                expect(response.body).toEqual(createdProduct);
            })
            it('THEN should create product', async () => {
                expect(createProductUseCaseMock.execute).toHaveBeenCalledWith(dto.name, dto.description);
            });
        });

        describe('WHEN a GET request is sent to /product/search', () => {
            const name = 'Test';
            const page = 1;
            const limit = 10;
            const mockPaginationData: PaginationData<Product> = {
                data: [{ id: 1, name: 'Test Product', description: 'Test' }],
                total: 1,
                page,
                perPage: limit,
            };
            let response
            beforeEach(async () => {
                searchByNameUseCaseMock.execute.mockResolvedValue(mockPaginationData);
                response = await request(app.getHttpServer())
                    .get('/product/search')
                    .query({ name, page, limit })
            })

            afterEach(()=>{
                jest.resetAllMocks()
            })
            it('THEN should response with http ok code', async () => {
                expect(response.status).toBe(HttpStatus.OK);


            })
            it('THEN should response list of product', async () => {
                expect(response.body).toEqual(mockPaginationData);

            })
            it('THEN should search product', async () => {
                expect(searchByNameUseCaseMock.execute).toHaveBeenCalledWith(name, page, limit);
            })
        });
    })


});
