import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.BACKEND_PORT,
    token: process.env.TOKEN
};
