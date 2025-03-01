import { getConnection } from 'typeorm';

beforeAll(async () => {
    const connection = getConnection();
    await connection.runMigrations();
});

afterAll(async () => {
    const connection = getConnection();
    await connection.close();
});