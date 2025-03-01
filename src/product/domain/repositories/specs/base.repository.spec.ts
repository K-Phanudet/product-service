import { Repository } from "typeorm";

import { BaseRepository } from "../base.repository";
import { PaginationData } from "../../interfaces/pagination-data.interface";

class MockEntity {
    id: number;
    name: string;
}

describe('BaseRepository', () => {
    let repositoryMock: jest.Mocked<Repository<MockEntity>>;
    let baseRepository: BaseRepository<MockEntity>;

    beforeEach(() => {
        repositoryMock = {
            findAndCount: jest.fn(),
        } as unknown as jest.Mocked<Repository<MockEntity>>;

        baseRepository = new BaseRepository<MockEntity>(repositoryMock, MockEntity);
    });

    afterAll(() => {
        jest.restoreAllMocks()
    })

    describe('GIVEN database connection is ok', () => {
        describe('WHEN method findAllWithPagination have been call', () => {
            const mockData = [
                { id: 1, name: 'product#1' },
                { id: 2, name: 'product#2' },
            ];

            beforeEach(() => {
                repositoryMock.findAndCount.mockResolvedValue([mockData, mockData.length]);
            })

            afterEach(() => {
                jest.resetAllMocks()
            })
            it('THEN should call findAndCount method with correct params', async () => {
                await baseRepository.findAllWithPagination({}, 1, 2, {});
                expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
                    where: {},
                    skip: 0,
                    take: 2,
                    order: {},
                });
            });
            it('THEN should return paginated data', async () => {
                const result: PaginationData<MockEntity> = await baseRepository.findAllWithPagination({}, 1, 2, {});
                expect(repositoryMock.findAndCount).toHaveBeenCalledWith({
                    where: {},
                    skip: 0,
                    take: 2,
                    order: {},
                });
                expect(result).toEqual({
                    data: mockData,
                    total: mockData.length,
                    page: 1,
                    perPage: 2,
                });
            });

            it('THEN should calculate the correct skip value for pagination', async () => {
                await baseRepository.findAllWithPagination({}, 3, 10, {});

                expect(repositoryMock.findAndCount).toHaveBeenCalledWith(
                    expect.objectContaining({ skip: 20 })
                );
            });
        });
    });

});