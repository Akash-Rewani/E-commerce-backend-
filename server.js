import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import connectCloudinary from './config/cloudinary.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import contactRouter from './routes/contactRoute.js'

const app = express()
const port = process.env.PORT || 4000

await connectDB()
await connectCloudinary()

const allowedOrigins = ['https://bazario-kqnlthqa1-akashrewani8-4304s-projects.vercel.app']


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)
app.use('/contact', contactRouter)


app.get('/', (req, res) => {
    res.send('API sucessfully connected')
})

app.listen(port, () => {
    console.log(`Server is running at port http://localhost:${port}`);
})