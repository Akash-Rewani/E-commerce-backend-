import jwt from 'jsonwebtoken'

const cookieOptions = {
    httpOnly: true,
    secure: process.env.APP_ENV === 'production',
    sameSite: process.env.APP_ENV === 'production' ? 'none' : 'strict'
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })
            res.cookie('adminToken', token, {
                ...cookieOptions,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({
                success: true,
                message: 'Admin Login Success',
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid Credentials',
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const isAdminAuth = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('adminToken', cookieOptions)
        return res.status(200).json({
            success: true,
            message: 'Admin Logut Success'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}