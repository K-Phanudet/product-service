import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepository } from "../product.repository";
import { getConnectionToken, TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../../entities/product.entity";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmConfigService } from "../../../../config/database.config";
import { PaginationData } from "../../interfaces/pagination-data.interface";
import { Connection } from "typeorm";

describe('[Integration] ProductRepository', () => {
    let repository: ProductRepository;
    let connection: Connection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ envFilePath: '.env.repository' }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    useClass: TypeOrmConfigService,
                }),
                TypeOrmModule.forFeature([Product]),
            ],
            providers: [ProductRepository],
        }).compile();

        repository = module.get<ProductRepository>(ProductRepository);
        connection = module.get<Connection>(getConnectionToken());

    }, 10000);

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })
    describe('GIVEN database connection is ok', () => {
        describe('WHEN create product', () => {
            it('THEN should save product into database', async () => {
                const result = await repository.createProduct('test', '111')
                const product = await repository.getProduct(result.id)
                expect(product).toBeDefined()
                expect(product?.id).toBeDefined()
            });
        });
    });

    describe('GIVEN database is not empty', () => {
        const productStartWithCom = [
            ['computer#1', "test"],
            ['commart', "test"]
        ]
        const page = 1
        const perPage = 1
        let firstProduct

        beforeEach(async () => {
            await repository.delete({})

            firstProduct = await repository.createProduct("mobile", "device")
            await repository.createProduct(productStartWithCom[0][0], productStartWithCom[0][1]);
            await repository.createProduct(productStartWithCom[1][0], productStartWithCom[1][1]);
        })


        describe('WHEN getProduct that exist', () => {
            it('THEN should return matched product', async () => {
                const response = await repository.getProduct(firstProduct.id)
                expect(response).toBeDefined()
            })
        })

        describe('WHEN getProduct that does not exist', () => {
            it('THEN should return matched product', async () => {
                const response = await repository.getProduct(1111)
                expect(response).toBeNull()
            })
        })


        describe('WHEN searching product that exist', () => {
            let response: PaginationData<Product>
            beforeAll(async () => {
                response = await repository.searchByName('com', page, perPage)
            })
            it('THEN should return total equal matched data', () => {
                expect(response.total).toEqual(productStartWithCom.length)
            })
            it('THEN should return perPage correct', () => {
                expect(response.perPage).toEqual(perPage)
            })
            it('THEN should return page correct', () => {
                expect(response.page).toEqual(page)
            })
            it('THEN should return data', () => {
                expect(response.data.length).toBeGreaterThan(0)

            })
        });

        describe('WHEN searching product that not exist', () => {
            let response: PaginationData<Product>
            beforeAll(async () => {
                response = await repository.searchByName('rice', page, perPage)
            })
            it('THEN should return total equal matched data', () => {
                expect(response.total).toEqual(0)
            })
            it('THEN should return perPage correct', () => {
                expect(response.perPage).toEqual(perPage)
            })
            it('THEN should return page correct', () => {
                expect(response.page).toEqual(page)
            })
            it('THEN should return data', () => {
                expect(response.data.length).toEqual(0)

            })
        });
    });

    describe('GIVEN database empty', () => {
        const page = 1
        const perPage = 1


        describe('WHEN searching product', () => {
            let response: PaginationData<Product>
            beforeAll(async () => {
                response = await repository.searchByName('rice', page, perPage)
            })
            it('THEN should return total equal matched data', () => {
                expect(response.total).toEqual(0)
            })
            it('THEN should return perPage correct', () => {
                expect(response.perPage).toEqual(perPage)
            })
            it('THEN should return page correct', () => {
                expect(response.page).toEqual(page)
            })
            it('THEN should return data', () => {
                expect(response.data.length).toEqual(0)

            })
        });
    });
});