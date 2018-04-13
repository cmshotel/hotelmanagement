var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var general = require("../../bin/settings/general.js").generaldetails();
var mailserver = require("../../bin/settings/mailserver.js").maildetails();


router.get("/general",function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/general", {
            session: req.session
        });
    else res.redirect("/login");
});

router.post("/loadSettings",function(req, res, next){
    if(req.body.actions=='general'){
        res.send(general);
    }
    else if(req.body.actions=='mailserver'){
        /*console.log(req.body);
        console.log(mailserver);*/
        res.send(mailserver);
    }
});


router.post("/general", function(req,res,next){
    fs = require("fs");
    /*
    *Read object data in string
     */
   st = "jso = { name:'"+ req.body.name+
        "',timezone:'"+ req.body.timezone+
        "',dateformate:'"+req.body.dateformate+
        "',timeformate:'"+req.body.timeformate+
        "',weekstart:'"+req.body.weekstart+
        "'};\n"+
        "module.exports = {" +
        " generaldetails: function() {" +
                "return  jso;" +
        "}"+
        "};"; 

    /*console.log(st);*/

    /*File Exist */
    fs.writeFile("./bin/settings/general.js",st, err => {
        if (err) throw err;
    });

});

router.get("/databaseSetting",function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/databaseSetting", {
            session: req.session
        });
    else res.redirect("/login");
});

router.post("/mailServer", function(req,res,next){
        fs = require("fs");
        /*
        *Read object data in string
         */
        st = "jso = {mailserver:'"+ req.body.mailserver+
                "',email:'"+ req.body.email+
                "',password:'"+req.body.password+
                "',certificate:'"+req.body.certicficate+
                "',port:'"+req.body.port+
            "'};\n"+
            "module.exports = {" +
            "maildetails: function() {" +
                   "return  jso;" +
            "}"+
            "};";
        /*File Exist */
        fs.writeFile("./bin/settings/mailserver.js",st, err => {
            if (err) throw err;
        });
});

router.get("/mailServer",function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/mailServer", {
            session: req.session
        });
else res.redirect("/login");

});

router.get("/userSetting",function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render("settings/userSetting", {
            session: req.session
        });
    else res.redirect("/login");
});

module.exports = router;