import { TypeOrmModuleOptions } from '@nestjs/typeorm';


export const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'database',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'mydb',
    entities: [__dirname + '/src/product/domain/entities/*.entity{.ts,.js}'],
    synchronize: true,
};
