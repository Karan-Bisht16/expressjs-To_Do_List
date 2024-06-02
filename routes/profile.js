const express = require("express");
const User = require("../models/user");
const List = require("../models/list");
const Task = require("../models/task");

const router = express.Router();

router.get("/profile/:id", (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    if (req.session.userID && req.session.userName && req.session.userEmail && req.session.userID == id) {
        res.render("profile.ejs", { ID: req.session.userID, name: req.session.userName, error: null });
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
                res.redirect("/");
            });
        } catch (error) {
            console.log("Error deleting user: " + error);
        }
    } else {
        res.render("profile.ejs", { ID: req.session.userID, error: "Invalid user id. Please refresh" });
    }
});

module.exports = router;