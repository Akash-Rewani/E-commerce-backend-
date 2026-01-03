import express from "express";
import { addProduct, changeStock, listProduct, singleProduct } from "../controllers/productController.js";
import { upload } from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";


const productRouter = express.Router()

productRouter.post('/add', upload.array(['images']), addProduct) //authAdmin
productRouter.get('/list', listProduct)
productRouter.post('/single', singleProduct)
productRouter.post('/stock', changeStock)

export default productRouter