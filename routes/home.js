const express = require("express");
const List = require("../models/list");
const Task = require("../models/task");

const router = express.Router();

router.get("/", async (req, res) => {
    req.session.currentTheme = req.session.currentTheme || false;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        let lists = await List.find({ list_user_id: req.session.userID });
        let tasks = await Task.find({ task_list_id: req.session.currentListID });
        res.render("index.ejs", { ID: req.session.userID, name: req.session.userName, email: req.session.userEmail, currentListID: req.session.currentListID, tasks, lists, loggedIn: true, theme: req.session.currentTheme });
    } else {
        res.render("index.ejs", { loggedIn: false, theme: req.session.currentTheme });
    }
});

router.put("/add-task", async (req, res) => {
    const { title } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        let list = await List.findById(req.session.currentListID);
        let newTask = new Task({
            task_name: title,
            task_list_id: list._id,
            task_user_id: list.list_user_id,
            is_Checked: false
        });
        try {
            let task = await newTask.save();
            res.send({ taskID: task._id });
        } catch (error) {
            console.log("Error saving task: " + error);
            res.sendStatus(500);
        }
    } else {
        res.send({ taskID: null });
    }
});

router.put("/strike-task", async (req, res) => {
    const { taskID, is_striked } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        try {
            await Task.findByIdAndUpdate({ _id: taskID }, { is_Checked: !is_striked });
        } catch (error) {
            console.log("Error updating is_Checked: " + error);
            res.sendStatus(500);
        }
    }
    res.send({ striked: !is_striked });
});

router.delete("/remove-task", async (req, res) => {
    const { taskID } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        try {
            await Task.findByIdAndDelete(taskID);
        } catch (error) {
            console.log("Error removing task: " + error);
            res.sendStatus(500);
        }
    }
    res.sendStatus(200);
});

router.patch("/edit-task", async (req, res) => {
    const { taskID, title } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        try {
            await Task.findByIdAndUpdate(taskID, { task_name: title });
        } catch (error) {
            console.log("Error editing task: " + error);
            res.sendStatus(500);
        }
    }
    res.sendStatus(200);
});

router.patch("/change-list", async (req, res) => {
    const { listID } = req.body;
    try {
        let list = await List.findById(listID);
        req.session.currentListID = list._id;
        req.session.currentListName = list.list_name;
    } catch (error) {
        console.log("Error changing list: " + error);
        res.sendStatus(500);
    }
    res.sendStatus(200);
});

router.post("/add-list", async (req, res) => {
    const { title } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        let newList = new List({
            list_name: title,
            list_user_id: req.session.userID,
        });
        try {
            let list = await newList.save();
            res.send({ listID: list._id });
        } catch (error) {
            console.log("Error saving list: " + error);
            res.sendStatus(500);
        }
    } else {
        res.send({ listID: null });
    }
});

router.patch("/rename-list", async (req, res) => {
    const { listID, title } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        try {
            await List.findByIdAndUpdate(listID, { list_name: title });
        } catch (error) {
            console.log("Error renaming list: " + error);
            res.sendStatus(500);
        }
    }
    res.sendStatus(200);
});

router.delete("/remove-list", async (req, res) => {
    const { listID } = req.body;
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        try {
            await List.findByIdAndDelete(listID);
            await Task.deleteMany({ task_list_id: listID });
            if (listID == req.session.currentListID) {
                const newCurrentList = await List.findOne({ list_user_id: req.session.userID });
                req.session.currentListName = newCurrentList.list_name;
                req.session.currentListID = newCurrentList._id;
                res.send({ currentListDeleted: true });
            } else {
                res.send({ currentListDeleted: false });
            }
        } catch (error) {
            console.log("Error removing list: " + error);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(200);
    }
});

router.put("/change-theme", async (req, res) => {
    req.session.currentTheme = req.body.theme;
    res.sendStatus(200);
});

module.exports = router;