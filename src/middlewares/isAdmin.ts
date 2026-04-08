import {Request, Response, NextFunction } from "express";
require('dotenv').config();
import jwt from 'jsonwebtoken'
export default function isAdmin(req: Request, res: Response, next: NextFunction){
  const authHeader = req.headers.authorization as string || req.headers.Authorization as string;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;
  if(token){
    jwt.verify(token, process.env.SECRET_KEY as string, async (error, decoded ) => {
     if (!error && decoded && typeof decoded !== 'string') {
        if (decoded.role === 'admin') {
          req.userId = decoded.userId;
          next();
        }
        else return res.status(403).json({message:"bạn không phải là admin"})
      }else {
        return res.status(403).send('invaild token')
      }
    })
  } 
}