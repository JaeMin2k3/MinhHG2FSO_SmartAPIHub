import express from 'express';
import { getDynamic, createDynamic, updateDynamic, deleteDynamic } from '../controllers/dynamicController.controller';
import isAdmin from '../middlewares/isAdmin';
import isUser from '../middlewares/isUser'
const Router = express.Router();

// Định tuyến các HTTP methods vào đúng hàm controller
Router.get('/:resource', isUser, getDynamic);
Router.post('/:resource', isAdmin, createDynamic);
Router.patch('/:resource/:id', isAdmin, updateDynamic);
Router.delete('/:resource/:id',isAdmin, deleteDynamic);

export default Router;