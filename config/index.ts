import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || "8080";
export const ROOT_DIR = process.env.ROOT_DIR || "";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_HOST = process.env.DB_HOST || "";
export const DB_NAME = process.env.DB_NAME || "";
export const DB_PORT = process.env.DB_PORT || "";
export const URL_FRONTEND = process.env.URL_FRONTEND || "";
export const URL_RUNNER = process.env.URL_RUNNER || "";
export const URL_BACKEND_CONTESTS = process.env.URL_BACKEND_CONTESTS || "http://localhost:8080";
export const URL_PUBLIC_KEY = process.env.URL_PUBLIC_KEY || "";
export const URL_PRIVATE_KEY = process.env.URL_PRIVATE_KEY || "";
