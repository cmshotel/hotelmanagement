var mongo = require('mongodb');
var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";
var bodyParser = require("body-parser");
var assert = require('assert');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	console.log(new Date+" POST /sendContent");
	if (req.xhr) {
		var saved_content;
		mongo.connect(murl, function (err, db) {
			db.collection('contents').find().toArray(function (err, result) {
				if (err) return console.log("Error saving html content into database: " + err);
				if (result != '') {
					saved_content = result['0'].content;
					res.setHeader('Access-Control-Allow-Methods', 'GET');
					res.json({
						user: uid,
						content: saved_content
					});
					// console.log(result['0'].content);
				} else {
					//saved_content = ;
					res.setHeader('Access-Control-Allow-Methods', 'GET');
					res.json({
						user: uid
					});
					console.log(uid);
					console.log("no data");
				}
			});
		});
	} else {
		res.render('theme/blank');
	}
});

router.post('/sendContent', function (req, res, next) {
	console.log(new Date+" POST /sendContent");
	var content = req.body.content;
	mongo.connect(murl, function (err, db) {
		db.collection('contents').updateOne({
			"action": "send-content"
		}, req.body, {
			upsert: true,
		});
	});
});
module.exports = router;