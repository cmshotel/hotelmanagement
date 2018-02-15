var mongo = require('mongodb');
var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";

var bodyParser = require("body-parser");
var assert = require('assert');
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
	console.log('Url is: ' + req.url);
	next(); // make sure we go to the next routes and don't stop here
  });

router.get('/', function (req, res) {
	res.render('history/index');
	console.log(new Date()+"/history");
});

router.post('/getBookedData', function (req, res) {
	console.log(new Date()+ " POST  /getBookedData");
	mongo.connect(murl, function (err, db) {
		console.log(err);
		collection = db.collection("booking");
		collection.find().limit(20).toArray(function (err, docs) {

			jso = [];

			for (i = 0; i < docs.length; i++) {
				book = docs[i];
				jso[i] = {
					_id: docs[i]["_id"],
					cname: docs[i]["cname"],
					contact: docs[i]["contact"],
					email: docs[i]["email"],
					bookdate: docs[i]["bookdate"],
					rooms: docs[i]["rooms"],
					chkin: docs[i]["chkin"],
					chkout: docs[i]["chkout"],
					nights: docs[i]["nights"],
					catagory: docs[i]["catagory"],
					plan: docs[i]["plan"],
					exbed: docs[i]["exbed"],
					cwextrabed: docs[i]["cwextrabed"],
					cwoextrabed: docs[i]["cwoextrabed"],
					roomprice: docs[i]["roomprice"],
					totroomcost: docs[i]["totroomcost"],
					plancharges: docs[i]["plancharges"],
					extrabed: docs[i]["extrabed"],
					childwexcost: docs[i]["childwexcost"],
					childwoexcost: docs[i]["childwoexcost"],
					tothotelcost: docs[i]["tothotelcost"],
					staygstrate: docs[i]["staygstrate"],
					foodgstrate: docs[i]["foodgstrate"],
					staygst: docs[i]["staygst"],
					foodgst: docs[i]["foodgst"],
					totalgst: docs[i]["totalgst"],
					finalpr: docs[i]["finalpr"],
					amtpaid: docs[i]["amtpaid"],
					pmtinfo: docs[i]["pmtinfo"],
					status: docs[i]["status"],
				}
			}
			jso = JSON.parse(JSON.stringify({
				"data": jso
			}));
			// console.log(jso);
			res.send(jso);
		});
	});

});

router.post('/getview', function (req, res) {
	var from = req.body.from;
	var to = req.body.to;
	var flg = req.body.flg;

	if (flg.localeCompare("bookdate") == 0) {
		mongo.connect(murl, function (err, db) {
			assert.equal(null, err);
			db.collection('booking').find({
				"bookdate": {
					$gte: from,
					$lte: to
				}
			}).toArray(function (err, docs) {
				assert.equal(null, err);
				db.close()
				res.send(docs);
			});
		});
	}

	if (flg.localeCompare("chkindate") == 0) {
		mongo.connect(murl, function (err, db) {
			assert.equal(null, err);
			db.collection('booking').find({
				"chkin": {
					$gte: from,
					$lte: to
				}
			}).toArray(function (err, docs) {
				assert.equal(null, err);
				db.close()
				res.send(docs);
			});
		});
	}
});

module.exports = router;