import express, { Request, Response, NextFunction } from 'express';
import bodyParse from 'body-parser';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { runMigration } from './db/migrate';
import { db } from './db/knex';
import dynamicRouter from './routes/dynamicRouter.route';
import userRouter from './routes/userRouter.route';
import cors from 'cors';
const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParse.json());
app.use(express.urlencoded({ extended: true }));

const swaggerFilePath = path.join(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.raw('SELECT 1');
    return res.status(200).json({ message: "server is running" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" }); 
  }
});

app.use('/api', dynamicRouter);
app.use('/auth', userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Global Error]:", err.message);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        status: "error",
        message: err.message || "Lỗi máy chủ nội bộ (Internal Server Error)",
    });
});

async function Start() {
  await runMigration();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Xem tài liệu API tại: http://localhost:${port}/api-docs`);
  });
}

Start();