import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.BACKEND_PORT,
    base_url: process.env.VITE_BASE_URL,
    token: process.env.TOKEN,
    secret_key: process.env.SECRET_KEY,
    web_app_url: process.env.WEB_APP_URL || "http://localhost:3000",
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
    cors_url: process.env.CORS_URL
};
