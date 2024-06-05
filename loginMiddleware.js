const loggedIn = (req, res, next) => {
    if (req.session.userID && req.session.userEmail && req.session.userName) {
        return next();
    } else {
        return res.sendStatus(403);
    }
};

const alreadyLoggedIn = (req, res, next) => {
    if (req.session.userID && req.session.userEmail && req.session.userName && req.session.userID) {
        return res.redirect("/");
    } else {
        return next();
    }
}

module.exports = { loggedIn, alreadyLoggedIn };