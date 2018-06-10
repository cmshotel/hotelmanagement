var express = require("express");
// var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var mongoUtil = require('../../bin/mongoUtil');
// var general = require("../../bin/settings/general.js").generaldetails();
// var mailserver = require("../../bin/settings/mailserver.js").maildetails();


router.get("/general", function (req, res, next) {
    if (req.session.uid && req.session.email){
        console.log(req.session);
        res.render("settings/general", {
            session: req.session
        });}
    else res.redirect("/login");
});

router.post("/loadSettings", function (req, res, next) {
    mongoUtil.connectToServer(function (err, db) {
        db.collection('contents').findOne({key: 'options'}, function (err, data) {
            switch (req.body.actions) {
                case 'general':
                    res.json(data.general);
                    break;
                case 'mailserver':
                    console.log(data.mail_server);
                    res.json(data.mail_server);
                    break;
                case 'database':
                    res.json(data.database);
                    break;
                default:
                    res.json({
                        'err': 'Invaalid Settings Action',
                        'return': 'false'
                    });
                    break;
            }
        });
    });
});


router.post("/general", function (req, res, next) {
    fs = require("fs");
    /*
     *Read object data in string
     */
    var s = {
        "key": "general",
        "name": req.body.name,
        "timezone": req.body.timezone,
        "dateformate": req.body.dateformate,
        "timeformate": req.body.timeformate,
        "weekstart": req.body.weekstart
    }

    mongoUtil.connectToServer(function (err, db) {
        db.collection('contents').updateOne({
            'key': 'options'
        }, {
            $set: {
                'general': s
            }
        }, {
            upsert: true
        });
    });
    res.json('true');

});

router.get("/databaseSetting", function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/databaseSetting", {
            session: req.session
        });
    else res.redirect("/login");
});

router.post("/mailServer", function (req, res, next) {

    /*
     *Read object data in string
     */
    var m = {
        'server': req.body.mailserver,
        'email': req.body.email,
        'password': req.body.password,
        'certificate': req.body.certicficate,
        'port': req.body.port
    };
    /*File Exist */
    mongoUtil.connectToServer(function (err, db) {
        db.collection('contents').updateOne({
            'key': 'options'
        }, {
            $set: {
                'mail_server': m
            }
        }, {
            upsert: true
        });
        res.json('true');
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