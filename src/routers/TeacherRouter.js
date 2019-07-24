const express = require("express");
const auth = require("../middleware/auth");
const QuizModel = require("../models/QuizModel");
const router = express.Router();


router.get("/teacher", auth, (req, res) => {
    if (!(req.user && req.user.profession)) {
        res.render("errorPage", {
        })
    } else {
        res.render("teacherHome", {

        })

    }



})
router.get("/teacher/addExam", auth, (req, res) => {
    if (!(req.user && req.user.profession)) {
        res.render("errorPage", {
        })
    } else {
        res.render("addExam", {
        })
    }
})
router.post("/teacher/addExam", auth, async (req, res) => {
    if (!(req.user && req.user.profession)) {
        res.render("errorPage", {
        })
        return;

    }
    //res.send(req.body);

    const result = req.body;


    let quiz = {};
    quiz.title = result.title;
    quiz.published = false;
    quiz.teacher = req.user._id;
    quiz.questions = [];

    for (let i = 1; i < result.question.length; i++) {
        let question = {};
        question.question = result.question[i];
        question.answers = [];

        for (let j = 1; j < 5; j++) {
            let answer = {};

            answer.answer = result['answer' + j][i]

            answer.correctAnswer = (result[`correct${i}`] == j - 1);

            question.answers.push(answer);
        }
        quiz.questions.push(question);
    }
    try {
        quiz = new QuizModel(quiz);
        await quiz.save();
        res.send("You have added the exam");
    } catch (error) {
        console.log(error);

        res.send(error);
    }


})













module.exports = router;