//db connection

require("./db/dbConeection");

const express = require("express");
const path = require("path");
const userRouter = require("./routers/UserRouter");
const teacherRouter = require("./routers/TeacherRouter")
const studentRouter = require("./routers/StudentRouter");
var cookieParser = require("cookie-parser");
var session = require('express-session');
const port = process.env.PORT || 3000

//setup excpress
const app = express();
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
//setup HBS

app.set("view engine", 'hbs');
app.set("views", path.join(__dirname, "../templates/views"))
// setup cookies
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(teacherRouter);
app.use(studentRouter);



app.listen(port, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`);

})