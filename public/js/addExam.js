console.log("addExam loaded");
const fullQuestion = document.getElementById("fullQuestion");
const questionsList = document.getElementById("questionsList");
const addQuestionButton = document.getElementById("addQuestionButton");
var questionscount = 0;
var lastQuestion;


function addQuestion(e) {
    questionscount++;
    console.log(typeof document.getElementById("fullQuestion"));

    lastQuestion = fullQuestion.cloneNode(true);
    lastQuestion.removeAttribute("hidden");
    lastQuestion.setAttribute("id", "fullQuestion " + questionscount)
    //lastQuestion.firstChild().setAttribute("placeholder", "Question 1");
    //clone.setAttribute('id', "Question" + questionscount);
    lastQuestion.children[0].setAttribute('id', "question" + questionscount);
    lastQuestion.children[0].setAttribute('placeholder', "Question " + questionscount);
    lastQuestion.children[1].children[0].children[0].children[0].children[0].setAttribute("name", "correct" + questionscount);
    lastQuestion.children[1].children[0].children[1].children[0].children[0].setAttribute("name", "correct" + questionscount);
    lastQuestion.children[1].children[0].children[2].children[0].children[0].setAttribute("name", "correct" + questionscount);
    lastQuestion.children[1].children[0].children[3].children[0].children[0].setAttribute("name", "correct" + questionscount);
    /*
    lastQuestion.children[1].children[0].children[0].children[0].setAttribute("name", "correct" + questionscount)
    lastQuestion.children[1].children[1].children[0].children[0].setAttribute("name", "correct" + questionscount)
    lastQuestion.children[1].children[2].children[0].children[0].setAttribute("name", "correct" + questionscount)
    lastQuestion.children[1].children[3].children[0].children[0].setAttribute("name", "correct" + questionscount)
*/
    questionsList.appendChild(lastQuestion);
    try {
        e = e || window.event;
        e.preventDefault();
    } catch (error) {
    }
}
function removeQuestion(e) {
    let lastChild = questionsList.children[questionsList.children.length - 1];
    questionsList.removeChild(lastChild);

    questionscount--;

    try {
        e = e || window.event;
        e.preventDefault();
    } catch (error) {
    }
}
addQuestion();

