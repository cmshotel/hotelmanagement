var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var mongoUtil = require('../../bin/mongoUtil');

router.get("/general", function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/general", {
            session: req.session
        });
    else res.redirect("/login");
});

router.post("/loadSettings", function (req, res, next) {
    if (req.body.actions == 'general') {
        mongoUtil.connectToServer(function (err, db) {
            db.collection('options').find({
                'key': 'general'
            }).toArray(function (err, s) {
                res.json(s);
            });
        });
        res.send(general);
    } else if (req.body.actions == 'mailserver') {
        var mailserver = require("../../bin/settings/mailserver.js").maildetails();
        res.send(mailserver.maildetails());
    }
});


router.post("/general", function (req, res, next) {
    var general_settings = {
        "key": "general",
        "name": req.body.name,
        "timezone": req.body.timezone,
        "dateformate": req.body.dateformate,
        "timeformate": req.body.timeformate,
        "weekstart": req.body.weekstart
    }
    /*Store to database*/
    mongoUtil.connectToServer(function (err, db) {
        db.collection('options').updateOne({
            'key': 'general',
        }, general_settings, {
            upsert: false
        });
    });

});

router.get("/databaseSetting", function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/databaseSetting", {
            session: req.session
        });
    else res.redirect("/login");
});

router.post("/mailServer", function (req, res, next) {
    fs = require("fs");
    /*
     *Read object data in string
     */
    st = "jso = {mailserver:'" + req.body.mailserver +
        "',email:'" + req.body.email +
        "',password:'" + req.body.password +
        "',certificate:'" + req.body.certicficate +
        "',port:'" + req.body.port +
        "'};\n" +
        "module.exports = {" +
        "maildetails: function() {" +
        "return  jso;" +
        "}" +
        "};";
    /*File Exist */
    fs.writeFile("./bin/settings/mailserver.js", st, err => {
        if (err) throw err;
    });
});

router.get("/mailServer", function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/mailServer", {
            session: req.session
        });
    else res.redirect("/login");

});

router.get("/userSetting", function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/userSetting", {
            session: req.session
        });
    else res.redirect("/login");
});

module.exports = router;