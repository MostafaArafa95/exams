const express = require("express");
const auth = require("../middleware/auth");
const QuizModel = require("../models/QuizModel");
const router = express.Router();


router.get("/teacher", auth, async (req, res) => {
    if (!(req.user && req.user.profession)) {

        res.render("errorPage", {
        })
        return;
    }
    const quizList = await QuizModel.find({ teacher: req.user._id });
    //console.log(quizList);

    let quizListHTML = "";
    quizList.forEach(quiz => {
        let quizRow = `<tr>` +
            `<th style="text-align:left" ><a href="/teacher/edit/${quiz._id}">${quiz.title}</a></th>` +
            `<th>${quiz.questions.length}</th>`;
        if (!quiz.published) {
            quizRow += `<th><button class="myButton" onclick="window.location.href = '/teacher/publish/${quiz._id}';">Publish now</button></th>`
        } else
            quizRow += `<th><button class="redButton" onclick="window.location.href = '/teacher/unpublish/${quiz._id}';">Unpublish now</button></th>`
        quizRow += "<th></th></tr>"

        quizListHTML += quizRow;
    });


    //    console.log(quizListHTML);

    res.render("teacherHome", { quizListHTML });








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
        res.send("<p>You have added the exam<p><a href='/teacher'>go back</a>");
    } catch (error) {
        // console.log(error);

        res.send(error);
    }


})
router.get("/teacher/publish/:id", auth, async (req, res) => {
    // console.log(`ID:${req.params.id}`);
    try {
        const quiz = await QuizModel.findById(req.params.id);
        if (!quiz._id) {
            res.send("Could not get your quiz");
            return;
        }
        quiz.published = true;
        await quiz.save();
        res.send("<p>You have published the exam <p>" +
            "<a href='/teacher'>go back</a>");
        return;

    } catch (error) {
        res.send("Could not get your quiz");
        return;
    }

})
router.get("/teacher/unpublish/:id", auth, async (req, res) => {

    try {
        const quiz = await QuizModel.findById(req.params.id);
        if (!quiz._id) {
            res.send("Could not get your quiz");
            return;
        }
        quiz.published = false;
        await quiz.save();
        res.send("<p>You have unpublished the exam <p>" +
            "<a href='/teacher'>go back</a>");
        return;

    } catch (error) {
        res.send("Could not get your quiz");
        return;
    }






})

router.get("/teacher/edit/:id", auth, async (req, res) => {
    try {
        const quiz = await QuizModel.findById(req.params.id);
        if (!quiz._id) {
            res.send("Could not get your quiz");
            return;
        }
        let examHTML = "";
        // quiz.questions.forEach((question) => {
        //     examHTML
        // })
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            let checked = "checked";

            examHTML += `<div id="fullQuestion ${i + 1}" style="margin-bottom: 30px"  >` +
                `<input type="text" name="question" placeholder="Question ${i + 1}" class="questionInput" id='question${i}' value="${question.question}" >` + `<table>`;
            for (let j = 0; j < question.answers.length; j++) {
                const answer = question.answers[j];
                let checked = "";
                if (answer.correctAnswer) {
                    checked = `checked='checked'`
                }
                examHTML += `<tr>` +
                    `<th scope="col">` +
                    `<input type="radio" name="correct${i + 1}" value="${j}" style="all: unset" ${checked} />` +
                    `</th>` +
                    `<th scope="col">` +
                    `<input type="text" name="answer${j + 1}" placeholder="Answer ${j + 1}" value="${answer.answer}" />` +
                    `</tr>`


            }
            examHTML += `</table></div>`
            /*
        `<tr><th scope="col">` +
            `<input type="radio" name="correct${i+1}" value="0" style="all: unset" checked="checked" />`*/


        }
        res.render("editExam", {
            examTitle: quiz.title,
            examHTML,
            questionsCount: quiz.questions.length
        });



    } catch (error) {
        res.send("Could not get your quiz");
        return;

    }
})
router.post("/teacher/edit/:id", auth, async (req, res) => {
    if (!(req.user && req.user.profession)) {
        res.render("errorPage", {
        })
        return;

    }
    const oldQuiz = await QuizModel.findById(req.params.id);
    if (!oldQuiz._id) {
        res.send("Could not get your quiz");
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
        //quiz = new QuizModel(quiz);
        //await quiz.save();
        await QuizModel.replaceOne({ _id: oldQuiz._id }, quiz);
        res.send("<p>You have edited the exam<p><a href='/teacher'>go back</a>");
        //"<p>You have edited the exam<p>" +
        //"<a href='/teacher'>go back</a>")
    } catch (error) {
        // console.log(error);

        res.send(error);
    }

});












module.exports = router;