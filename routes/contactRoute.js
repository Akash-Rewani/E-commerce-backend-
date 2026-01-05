import express from "express";
import { contact } from "../controllers/contactController.js";
import authUser from "../middlewares/authUser.js";




const contactRouter = express.Router()

contactRouter.post('/message', contact)



export default contactRouter