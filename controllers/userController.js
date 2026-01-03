import userModel from "../models/userModel.js"
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: process.env.APP_ENV === 'production' ? 'none' : 'strict'
}
export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'User Or Email Alredy Exist'
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter Valid Email'
            })
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter String Password'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({
            success: true,
            message: 'User Registered Success',
            user: {
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User Not Found'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: 'User Login Success',
            user: {
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAuth = async (req, res) => {
    try {
        const { userId } = req
        const user = await userModel.findById(userId).select("-password")
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions)
        return res.status(200).json({
            success: true,
            message: 'User Logout Success'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}