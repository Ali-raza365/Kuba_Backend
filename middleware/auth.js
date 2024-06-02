const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const Authorization = req.header("Authorization") || ''
        var token = Authorization.split(' ')[1];

        if(!token) return res.status(400).json({message: "Invalid Authentication."})

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if(!decoded) return res.status(400).json({message: "Invalid Authentication."})
            const user = await Users.findOne({_id: decoded.id}) || {}
            if(!user) return res.status(400).json({message: "Invalid Authentication"})
            req.user = user
            next();
        } catch (error) {
            // Handle the specific error thrown by jwt.verify()
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired.' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token.' });
            } else {
                // For other types of errors, return a generic error message
                return res.status(500).json({ message: 'Internal server error.' });
            }
        }

    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}


module.exports = auth