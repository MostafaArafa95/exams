const excpress = require("express");
const UserModel = require("../models/UserModel");
const router = excpress.Router();
router.get("/", (req, res) => {
    res.redirect("login")
})
router.get("/signup", (req, res) => {
    res.render("signup", {
    })
})

//TODO: check for errors (this doesnt throw errors)
router.post("/signup", async (req, res) => {
    console.log(req.body);
    try {
        const user = await new UserModel(req.body);
        user.save();
        if (user._id)
            res.send("Done " + user._id);
        else {
            res.send(error.message);

        }

    } catch (error) {
        res.send(error.message);

    }




})
router.get("/login", (req, res) => {
    res.render("login", {

    })
})
router.post("/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        });


        if (user._id) {
            res.send("Done");
        } else {
            res.render("login", {
                errorMessage: "<div class='alert'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span><strong>Wrong</strong> email or password</div>"

            })
        }
    } catch (error) {
        res.render("login", {
            errorMessage: "<div class='alert'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span><strong>Wrong</strong> email or password</div>"

        })

    }
})



module.exports = router;