import orderModel from "../models/orderModel.js"
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

const currency = 'INR'
const deliveryCharges = 40
const taxPercentage = 0.02

export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body
        const userId = req.userId

        if (items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Add Items To Continue Order"

            })
        }
        let subtotal = await items.reduce(async (acc, item) => {
            const product = await productModel.findById(item.product)
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        const taxAmount = subtotal * taxPercentage
        const totalAmount = subtotal + taxAmount + deliveryCharges


        await orderModel.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentMethod: 'COD'
        })
        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        return res.status(201).json({
            success: true,
            message: 'Order Placed'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const placeOrderStripe = async (req, res) => {


}

export const userOrders = async (req, res) => {
    try {
        const userId = req.userId
        const orders = await orderModel.find({ userId, $or: [{ paymentMethod: "COD" }, { isPaid: true }] }).populate('items.product').sort({ createdAt: -1 })
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const allOrders = async (req, res) => {  // admin
    try {
        const orders = await orderModel.find({ $or: [{ paymentMethod: "COD" }, { isPaid: true }] }).populate('items.product').sort({ createdAt: -1 })
        res.json({
            success: true,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateStatus = async (req, res) => {  //admin
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({
            success: true,
            message: 'Order Status Updated'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}