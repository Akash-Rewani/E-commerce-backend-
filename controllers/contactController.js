import contactModel from "../models/contactSchema.js"

export const contact = async (req, res) => {
    const { fullName, email, message, phone } = req.body
    try {
        if (!fullName || !email || !phone || !message) {
            return res.status(401).json({
                success: false,
                message: 'Enter All Fields'
            })
        }
        const contact = await contactModel.create({
            fullName,
            email,
            phone,
            message,
        })
        return res.status(201).json({
            success: true,
            message: 'Message Sent Success',
            contact
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}