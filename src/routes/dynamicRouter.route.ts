import express from 'express';
import { getDynamic, createDynamic, updateDynamic, deleteDynamic,replaceDynamic } from '../controllers/dynamicController.controller';
import isAdmin from '../middlewares/isAdmin';
import isUser from '../middlewares/isUser'
const Router = express.Router();

Router.get('/:resource', isUser, getDynamic);
Router.post('/:resource', isAdmin, createDynamic);
Router.patch('/:resource/:id', isAdmin, updateDynamic);
Router.delete('/:resource/:id',isAdmin, deleteDynamic);
Router.put('/:resource/:id', isAdmin, replaceDynamic);
export default Router;