import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Загружаем .env.local для dev-окружения
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
