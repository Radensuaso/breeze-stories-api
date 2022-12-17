declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            MONGO_CONNECTION: string;
            JWT_SECRET: string;
            CLOUD_SECRET: string;
            CLOUD_NAME: string;
            CLOUD_KEY: string;
        }
    }
}

export { }; 
