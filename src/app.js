//db connection

require("./db/dbConeection");

const express = require("express");
const path = require("path");
const userRouter = require("./routers/UserRouter");

//setup excpress
const app = express();
const publicDirectory = path.join(__dirname, "../public");
app.use(express.static(publicDirectory));
//setup HBS

app.set("view engine", 'hbs');
app.set("views", path.join(__dirname, "../templates/views"))
// ///////
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`);

})