import express from 'express';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../validations/user.validation'
const Router = express.Router();
import {userLogin, userSignUp} from '../controllers/userController.controller'
Router.post('/login', validate(loginSchema), userLogin);
Router.post('/SignUp', validate(registerSchema), userSignUp)
export default Router;

