const jwt = require("jsonwebtoken");


const isAuthentication = (req, res, next) => {
    try {
        const token = req.headers['x-api-key'];
        if(token === undefined) {
            res.status(401).json({ status: false, message: 'Invalid token,please provide a valid token' });
        }
        const decoded = jwt.verify(token, "Shopping-Cart");
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if(error.message.includes('jwt') || error.message.includes('signature is not matching')) {
            res.status(401).json({ status: false, message: 'token is invalid' });
        }
        else {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}




module.exports = { isAuthentication };