import {Request, Response, NextFunction } from "express";
require('dotenv').config();
import jwt from 'jsonwebtoken'
export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization as string || req.headers.Authorization as string;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token" });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded) => {
    if (error || !decoded || typeof decoded === 'string') {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: "Bạn không phải là admin" });
    }
    req.userId = decoded.userId;
    next();
  });
}
