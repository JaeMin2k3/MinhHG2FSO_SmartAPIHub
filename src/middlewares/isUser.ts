import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
require('dotenv').config();
export default function isUser(req: Request, res: Response, next: NextFunction){
  const authHeader = req.headers.authorization as string || req.headers.Authorization as string;
  const token = authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : undefined;
  if(token){
    jwt.verify(token, process.env.SECRET_KEY as string, async (error, decoded)=> {
      if(!error && decoded && typeof decoded !== 'string'){
          req.userId = decoded.userId;
          next();
      }else return res.status(403).json({messsage: "invaild token"})
    })
  }
}