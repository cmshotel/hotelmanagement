// var mongo = require('mongodb');
// var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongoUtil = require("../../bin/mongoUtil");

router.get("/", function (req, res, next) {
  console.log(req.session);
  if (req.session.uid && req.session.email)
    res.render("theme/index", {
      session: JSON.stringify(req.session)
    });
  else res.render("theme/index");
});

router.get("/loadContent", function (req, res, next) {
  mongoUtil.connectToServer(function (err, db) {
    if (err) throw err;
    db.collection("contents")
      .find()
      .toArray(function (err, result) {
        if (err)
          console.log("Error fetching html content from database: " + err);
        if (result != "") {
          res.setHeader("Access-Control-Allow-Methods", "GET");
          res.json(result[0].content);
        } else {
          res.setHeader("Access-Control-Allow-Methods", "GET");
          res.json({
            session: req.session
          });
        }
      });
  });
});
router.post("/sendContent", function (req, res, next) {
  var content = req.body;
  req.body = {
    action: "jups",
    content: req.body
  };
  mongoUtil.connectToServer(function (err, db) {
    if (err) throw err;
    db.collection("contents").updateOne({
        action: "jups"
      },
      req.body, {
        upsert: true
      }
    );
  });
  res.json({
    data: "success"
  });
});
module.exports = router;