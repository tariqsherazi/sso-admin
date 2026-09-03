import { registerDatabaseConfiguration } from './src/config/database.config';

const databaseOptions = registerDatabaseConfiguration();

export default {
  ...databaseOptions,
  entities: ['src/database/entities/**/*{.ts, .js}'],
  // migrations: ['src/migrations/*.entity{.ts, .js}'],
  // migrationsTableName: "migrations",
  seeds: ['src/database/seeding/seeds/**/*{.ts,.js}'],
  factories: ['src/database/seeding/factories/**/*{.ts,.js}'],
};
