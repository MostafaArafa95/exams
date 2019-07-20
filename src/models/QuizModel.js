const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
    published: {
        type: Boolean,
        required: true,
    }, teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }, questions: [{
        question: {
            type: String
        },//TODO: validate there is only one right answer
        answers: [{
            answer: {
                type: String,
                required: true
            }, correctAnswer: {
                type: Boolean,
                required: true
            }, explanation: {
                type: String
            }
        }]
    }]
});
const QuizModel = new mongoose.model("Quiz", quizSchema);
module.exports = QuizModel;