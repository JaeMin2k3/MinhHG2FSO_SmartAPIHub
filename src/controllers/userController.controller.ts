import { NextFunction, Request, Response } from 'express';
import {db} from '../db/knex'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
require('dotenv').config();
export async function userLogin(req: Request, res: Response, next: NextFunction) {
    const {gmail, password} = req.body;
    if(!gmail || !password) return res.status(400).json({message: "vui lòng nhập đầy đủ password và email"})
    const result  = await db('user')
                    .select('*')
                    .where({email: gmail})
                    .first();
    // check su ton tai cua gmail
    if(!result) return res.status(400).json({message: "login fail"});
    console.log(result)
    //check password
    const isMatch = await bcrypt.compare(String(password), String(result.password));
    if(!isMatch) return res.status(401).json({message: "Email hoac Password khong dung"})
     
    // mk dung tao 1 phien dang nhap
    const payload = {userId : result.id, role: result.role}
    const secret = process.env.SECRET_KEY || 'secretKey'
    const token = jwt.sign(payload, secret, {expiresIn: '1h'} )
    if(!token) return res.status(500).json({message: "lỗi server khong the tạo dược token"})
    return res.status(200).json({
        message: "success",
        accessToken: token,
        tokenType: "Bearer",
        expires: 3600
    })
}
 export async function userSignUp (req: Request, res: Response, next: NextFunction){
    const trx = await db.transaction();

    try{
        const {email, name, password} = req.body;
        if(!email || !name || !password) return res.status(400).json({message: "vui long nhập đầy đủ thông tin cho tài khoản mới"})
        const checkEmail =  await db('user').select('email').where({email: email}).first();
        if(checkEmail) return res.status(409).json({message: "trung email"})
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = {
            name: name,
            email: email,
            password: passwordHash,
            role: "customer"
        }
        const result = await trx('user').insert(newUser);
        if(result){
            await trx.commit();
            return res.status(200).json({message: "success"})
        } else {
            await trx.rollback();
            return res.status(500).json({message: "lỗi server không thể đăng kí được"})
        }
    }catch(error){
        trx.rollback ();
        console.error(error);
        next(error);
    }
 }
