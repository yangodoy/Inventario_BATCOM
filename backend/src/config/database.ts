import dotenv from 'dotenv';
dotenv.config();

export interface DatabaseConfig {
  dialect: 'postgres' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  logging: boolean | ((msg: string) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

export const dbConfig: DatabaseConfig = {
  dialect: (process.env.DB_DIALECT as 'postgres' | 'mysql') || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'mil_inventory_db',
  username: process.env.DB_USER || 'mil_admin',
  password: process.env.DB_PASSWORD || 'SecureMilPass2026!',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 15,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
};

/**
 * Representación del objeto de conexión Sequelize
 * Si sequelize está instalado en el entorno de ejecución, se instancia:
 * 
 * import { Sequelize } from 'sequelize';
 * export const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
 *   host: dbConfig.host,
 *   port: dbConfig.port,
 *   dialect: dbConfig.dialect,
 *   pool: dbConfig.pool,
 *   logging: dbConfig.logging
 * });
 */
export const getSequelizeConnectionDetails = () => {
  return {
    dialect: dbConfig.dialect,
    connectionString: `${dbConfig.dialect}://${dbConfig.username}:******@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
    pool: dbConfig.pool,
  };
};
