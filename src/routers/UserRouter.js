const excpress = require("express");
const UserModel = require("../models/UserModel");
const auth = require("../middleware/auth");
const router = excpress.Router();

router.get("/", auth, (req, res) => {
    if (!req.user)
        res.redirect("login")
    else if (req.user.profession) {
        res.redirect("teacher")
    } else {
        res.redirect("/student");

    }
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
        await user.save();
        if (user._id) {
            const authToken = await user.generateAuthToken();
            req.session.authToken = authToken;
            req.session.name = "HIII"

            //res.send("You logged in as " + user.name);
            res.redirect("/");

        }
        else {
            res.render("signup", {
                errorMessage: `<div class='alert'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span>Could not signup</div>`

            })

        }

    } catch (error) {
        res.render("signup", {
            errorMessage: `<div class='alert'><span class='closebtn' onclick='this.parentElement.style.display='none';'>&times;</span>${error.message}</div>`

        })

    }




})
router.get("/login", auth, (req, res) => {
    if (req.user) {


        res.send("You logged in as " + req.user.name);
    }
    else
        res.render("login", {

        })
})
router.post("/login", async (req, res) => {
    try {
        /* const user = await UserModel.findOne({
             email: req.body.email,
             password: req.body.password
         });*/
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        if (user._id) {
            const authToken = await user.generateAuthToken();
            req.session.authToken = authToken;
            req.session.name = "HIII"

            if (user.profession) {
                res.redirect("/teacher")

            } else {
                res.redirect("/student")

            }


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
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});



module.exports = router;