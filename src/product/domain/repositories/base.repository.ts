import { Repository, EntityTarget, DeleteResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationData } from '../interfaces/pagination-data.interface';

@Injectable()
export class BaseRepository<T extends Record<string, any>> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly entity: EntityTarget<T>,
  ) {}

  async findAllWithPagination(
    where: Record<string, any> = {},
    page: number = 1,
    limit: number = 10,
    order: Record<string, any> = {},
  ): Promise<PaginationData<T>> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await this.repository.findAndCount({
      where,
      skip,
      take,
      order
    });

    return {
        data,
        total,
        page,
        perPage: limit
    }
  }

  async delete(filters: Partial<T>): Promise<DeleteResult> {
    return this.repository.delete(filters);
  }
}
