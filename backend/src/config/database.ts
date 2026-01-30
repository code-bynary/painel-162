import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_AUTH,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const checkDatabaseConnection = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('Successfully connected to MySQL database');
        connection.release();
        return true;
    } catch (error) {
        logger.error('Failed to connect to database', error);
        return false;
    }
};

export default pool;
