import express, { NextFunction } from 'express'
import bodyParse from 'body-parser'
import {Request, Response} from 'express'
import { runMigration } from './db/migrate';
import  {db} from './db/knex'
const app = express();
app.use(bodyParse.json())
app.use(express.urlencoded({ extended: true }));
const port = 3000;
import dynamicRouter from './routes/dynamicRouter.route'
import userRouter from './routes/userRouter.route'
app.use('/health', async (req: Request, res: Response, next: NextFunction)=>{
  try {
    await db.raw('SELECT 1');
    return res.status(200).json({message: "server is running"})
  } catch (error) {
    return res.status(5000).json({message: "Lỗi server"})
  }
  
})
app.use('/api', dynamicRouter);
app.use('/auth', userRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[Global Error]:", err.message);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        status: "error",
        message: err.message || "Lỗi máy chủ nội bộ (Internal Server Error)",
    });
});

async function Start(){
  await runMigration();
  app.listen(port, ()=>{
    console.log("server is running")
  })
}
Start();