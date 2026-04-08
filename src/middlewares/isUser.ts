import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
require('dotenv').config();

export default function isUser(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') 
                ? authHeader.split(' ')[1] 
                : undefined;

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }else{
    jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded) => {
      console.log(error)
    if (error) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }else if (decoded && typeof decoded !== 'string') {
      req.userId = decoded.userId; 
      return next(); 
    }
   
  });
  }

  
}