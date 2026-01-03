import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import { allOrders, placeOrderCOD, updateStatus , placeOrderStripe, userOrders } from "../controllers/orderController.js";
import authUser from "../middlewares/authUser.js";



const orderRouter = express.Router()

orderRouter.post('/list', authAdmin, allOrders) //admin
orderRouter.post('/status', authAdmin, updateStatus)

orderRouter.post('/cod',authUser , placeOrderCOD)
orderRouter.post('/', authUser , placeOrderStripe)// not created yet


orderRouter.post('/userorders', authUser , userOrders) //user

export default orderRouter