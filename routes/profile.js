const express = require("express");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/user");
const List = require("../models/list");
const Task = require("../models/task");

const router = express.Router();

router.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    if (req.session.userID && req.session.userName && req.session.userEmail && req.session.userID == id) {
        res.render("profile.ejs", { user: req.session });
    } else {
        res.redirect("/");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Session destruction error:", err);
            return;
        }
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    if (req.session.userID == id) {
        try {
            await User.findByIdAndDelete(id);
            await List.deleteMany({ list_user_id: id });
            await Task.deleteMany({ task_user_id: id });
            req.session.destroy(err => {
                if (err) {
                    console.error("Session destruction error:", err);
                    return;
                }
                res.clearCookie("connect.sid");
                res.redirect("/");
            });
        } catch (error) {
            console.log("Error deleting user: " + error);
        }
    } else {
        res.render("profile.ejs", { user: req.session, accountError: "Invalid user id. Please refresh" });
    }
});

router.patch("/profile/:id/change-password", async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (req.session.userID && req.session.userName && req.session.userEmail && req.session.userID == id) {
        let user = await User.findById(req.session.userID);
        bcrypt.compare(oldPassword, user.user_password, async (err, result) => {
            if (err) {
                res.send({ "code": 3 });
            }
            if (result) {
                bcrypt.hash(newPassword, saltRounds, async (err, hashedPassword) => {
                    if (err) {
                        res.send({ "code": 3 });
                    }
                    await User.findByIdAndUpdate(req.session.userID, { user_password: hashedPassword });
                    res.send({ "code": 1 });
                })
            } else {
                res.send({ "code": 0 });
            }
        });
    } else {
        res.send({ "code": 2 });
    }

});

module.exports = router;