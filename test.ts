import bcrypt from "bcrypt"
const mk = "123456"
const pass = bcrypt.hashSync(mk, 10);
console.log(pass)