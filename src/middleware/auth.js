const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel')
const auth = async (req, res, next) => {
    try {
        const token = req.session.authToken;

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findOne({
            _id: decoded._id,
            'tokens.token': token
        });
        if (!user) {
            return;
        }
        req.token = token;
        req.user = user;
        next();


    } catch (e) {
        //console.log(e);

        req.user = null;
        req.token = null;
        next();
    }


}
module.exports = auth;