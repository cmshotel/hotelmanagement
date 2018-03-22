// var mongo = require('mongodb');
// var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";
var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var assert = require("assert");
var mongoUtil = require("../../bin/mongoUtil");

router.get("/", function(req, res, next) {
  if (req.session.uid && req.session.email)
    res.render("theme/index", {
      session: req.session
    });
  else 
    res.render("theme/index");
});

router.post("/loadContent", function(req, res, next) {
  var saved_content;
  mongoUtil.connectToServer(function(err, db) {
    if (err) throw err;
    db.collection("contents")
      .find()
      .toArray(function(err, result) {
        if (err)
          console.log("Error fetching html content from database: " + err);
        if (result != "") {
          saved_content = result["0"].content;
          res.setHeader("Access-Control-Allow-Methods", "GET");
          res.json({
            content: saved_content,
            session: req.session
          });
        } else {
          res.setHeader("Access-Control-Allow-Methods", "GET");
          res.json({
            session: req.session
          });
        }
      });
  });
});
router.post("/sendContent", function(req, res, next) {
  var content = req.body;
  console.log(content);
  mongoUtil.connectToServer(function(err, db) {
    if (err) throw err;
    db.collection("contents").updateOne(
      {
        action: "send-content"
      },
      req.body,
      {
        upsert: true
      }
    );
  });
  res.json({
    data: "success"
  });
});
module.exports = router;
