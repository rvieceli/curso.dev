declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      POSTGRES_HOST: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      POSTGRES_PORT: string;
    }
  }
}

export {};
