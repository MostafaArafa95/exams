const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");//TODO: encrypt the password before saving 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }

        }
    }, password: {
        type: String,
        required: true,
        minlength: 6
    }, profession: {// The profession stands for either the account for a  student (false) or a teacher (true)
        type: Boolean,
        required: true
    }, name: {
        type: String,
        trim: true,
    },/* grades: [{
        type: mongoose.Schema.Types.ObjectId,
        //TODO: uncomment ref
        //ref: "Quiz"
    }]*/
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;