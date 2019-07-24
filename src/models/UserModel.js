const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
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
        required: true
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    grades: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        }, grade: {
            type: String
        }


    }]
});
userSchema.pre('save', async function (next) {

    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();

})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("Unable to login (email)");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;

}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;