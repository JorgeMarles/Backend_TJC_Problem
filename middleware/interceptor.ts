
import axios, { AxiosInstance } from "axios";
import {
    URL_BACKEND_CONTESTS,
    URL_PUBLIC_KEY,
    URL_PRIVATE_KEY
} from "../config";
import fs from 'fs'
import jwt from 'jsonwebtoken'

const PRIVATE_KEY = fs.readFileSync(URL_PRIVATE_KEY, "utf8");
export const PUBLIC_KEY = fs.readFileSync(URL_PUBLIC_KEY, "utf8");

const addAuthInterceptor = (instance: AxiosInstance) => {
    instance.interceptors.request.use(
        (config) => {
            const info = {
                from: "backend-problems",
                type: "service"
            }
            try {
                const token = jwt.sign(info, PRIVATE_KEY, { algorithm: "RS256", expiresIn: "15m" });
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            } catch (error) {
                console.error("Error in interceptor:", error);
                throw error;
            }
        },
        (error) => Promise.reject(error)
    );
};

export const apiContests = axios.create({
    baseURL: URL_BACKEND_CONTESTS,
});

addAuthInterceptor(apiContests);

