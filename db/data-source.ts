import { DataSource, DataSourceOptions } from "typeorm";

let dbOptions: DataSourceOptions = {
  type: "sqlite",
  database: "",
  entities: [],
  migrations: ["db/migrations/*.js"],
};
console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  case "development":
    Object.assign(dbOptions, {
      type: "sqlite",
      database: "db.sqlite",
      entities: ["**/*.entity.js"],
    });
    break;
  case "test":
    Object.assign(dbOptions, {
      type: "sqlite",
      database: "test.sqlite",
      entities: ["**/*.entity.ts"],
      migrationsRun: true,
    });
    break;
  case "production":
    Object.assign(dbOptions, {
      type: "postgres",
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ["**/*.entity.js"],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    throw new Error("Unknown environment");
}

export const dataSourceOptions: DataSourceOptions = dbOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
