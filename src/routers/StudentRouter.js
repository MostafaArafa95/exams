const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UserModel = require("../models/UserModel");
const QuizModel = require("../models/QuizModel");
router.get("/student", auth, async (req, res) => {

    //getting teachers
    try {
        const teachers = await UserModel.find({ profession: true });
        let teachersListHTML = "";
        teachers.forEach((teacher) => {
            let teacherRow = `<tr>` +
                `<th style="text-align:left" ><a href="/student/teacher/${teacher._id}">${teacher.name}</a></th>` +
                `<th style="text-align:left" ><a href="/student/teacher/${teacher._id}">${teacher.email}</a></th>` +
                `</tr>`;
            teachersListHTML += teacherRow;

        })
        res.render("studentHome", {
            teachersListHTML
        })

    } catch (error) {
        console.log(error);

        res.send({
            error: "Something wrong happened"
        })

    }


})
router.get("/student/teacher/:id", auth, async (req, res) => {

    try {
        const quizes = await QuizModel.find({ teacher: req.params.id });
        let quizListHTML = "";
        quizes.forEach((quiz) => {
            if (quiz.published) {
                let quizRow = `<tr>` +
                    `<th style="text-align:left" >${quiz.title}</th>` +
                    `<th style="text-align:left" >${quiz.questions.length}</th>` +
                    `<th><button class="myButton" onclick="window.location.href = '/student/takeQuiz/${quiz._id}';">Take test</button></th>` +
                    `</tr>`;
                quizListHTML += quizRow;

            }

        })
        res.render("quizList", {
            quizListHTML
        })


    } catch (error) {
        res.send({ error: "Something wrong happened" })

    }



})
router.get("/student/takeQuiz/:id", auth, async (req, res) => {
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
                `<input type="text" name="question" placeholder="Question ${i + 1}" class="questionInput" id='question${i}' value="${question.question}" readonly>` + `<table>`;
            for (let j = 0; j < question.answers.length; j++) {
                const answer = question.answers[j];

                examHTML += `<tr>` +
                    `<th scope="col">` +
                    `<input type="radio" name="correct${i + 1}" value="${j}" style="all: unset"  readonly/>` +
                    `</th>` +
                    `<th scope="col">` +
                    `<input type="text" name="answer${j + 1}" placeholder="Answer ${j + 1}" value="${answer.answer}" readonly/>` +
                    `</tr>`


            }
            examHTML += `</table></div>`
            /*
        `<tr><th scope="col">` +
            `<input type="radio" name="correct${i+1}" value="0" style="all: unset" checked="checked" />`*/


        }
        res.render("takeQuiz", {
            examTitle: quiz.title,
            examHTML,
            questionsCount: quiz.questions.length
        });



    } catch (error) {
        res.send("Could not get your quiz");
        return;

    }



})
router.post("/student/takeQuiz/:id", auth, async (req, res) => {
    const result = req.body;
    let correctAnswers = 0;
    const studentAnswers = [];
    for (let i = 1; i < result.question.length; i++) {
        studentAnswers.push(result['correct' + i]);

    }
    // calculate result
    const quiz = await QuizModel.findById(req.params.id);

    for (let i = 0; i < studentAnswers.length; i++) {
        let possibleAnswer = quiz.questions[i].answers[studentAnswers[i]].correctAnswer;
        if (possibleAnswer) {
            correctAnswers++;
        }


    }

    res.send(`<p>You have taken the exam with score ${correctAnswers} / ${studentAnswers.length} <p><a href='/student'>go back</a>`);

})



module.exports = router;