const express = require("express");
// to encrypt passwords
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/user");
const List = require("../models/list");

const router = express.Router();

router.get("/login", (req, res) => {
    if (req.session.userID || req.session.userName || req.session.userEmail) {
        res.redirect("/");
    } else {
        res.render("userAuthentication.ejs", { error: null });
    }
});

router.post("/register", async (req, res) => {
    let { username, userEmail, userPassword } = req.body;
    // to make sure that all registered emails are unique
    let users = await User.find({ user_email: userEmail });
    if (users.length == 0) {
        // encrypting user password
        bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                res.render("userAuthentication.ejs", { error: "Registration failed. Try again." });
            }
            let newUser = new User({
                user_name: username,
                user_email: userEmail,
                user_password: hashedPassword,
            });
            // saving new user details in DB
            newUser.save()
                .then(async (result) => {
                    // these values will be used as display values on all other pages
                    req.session.userEmail = result.user_email;
                    req.session.userName = result.user_name;
                    req.session.userID = result._id;
                    let homeList = new List({
                        list_name: "Home",
                        list_user_id: result._id
                    });
                    await homeList.save();
                    let workList = new List({
                        list_name: "Work",
                        list_user_id: result._id
                    });
                    await workList.save();
                    req.session.currentListName = "Home";
                    req.session.currentListID = homeList._id;
                    res.redirect("/");
                })
                .catch(error => {
                    console.log("Error saving user data: ", error);
                    res.render("userAuthentication.ejs", { error: "Server side error. Try again." });
                });
        });
    } else {
        res.render("userAuthentication.ejs", { error: "User already exists." });
    }
});

router.post("/login", (req, res) => {
    let { userEmail, userPassword } = req.body;
    User.findOne({ user_email: userEmail })
        .then(user => {
            if (user) {
                bcrypt.compare(userPassword, user.user_password, async (err, result) => {
                    if (err) {
                        res.render("userAuthentication.ejs", { error: "Login failed. Try again." });
                    }
                    if (result) {
                        req.session.userEmail = user.user_email;
                        req.session.userName = user.user_name;
                        req.session.userID = user._id;
                        const list = await List.findOne({list_user_id: user._id});
                        console.log(list);
                        if (list === null) {
                            let homeList = new List({
                                list_name: "Home",
                                list_user_id: user._id
                            });
                            await homeList.save();
                            req.session.currentListName = "Home";
                            req.session.currentListID = homeList._id;
                        } else {
                            req.session.currentListName = list.list_name;
                            req.session.currentListID = list._id;
                        }
                        res.redirect("/");
                    } else {
                        res.render("userAuthentication.ejs", { error: "Incorrect password" });
                    }
                });
            } else {
                res.render("userAuthentication.ejs", { error: "User not found. <a href='#' onclick='redirectIfIncorrectPassword()'>Create an account</a>." });
            }
        })
        .catch(error => {
            console.log(error);
            res.render("userAuthentication.ejs", { error: "Network error. Try again." });
        });
});

module.exports = router;