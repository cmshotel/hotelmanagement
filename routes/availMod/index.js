var express = require('express');
var router = express.Router();
// var mongo = require('mongodb');
var assert = require('assert');
var mongoUtil = require('../../bin/mongoutil');
// var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";

/* GET home page. */


router.get('/', function (req, res) {
	if (req.session.uid && req.session.email)
		res.render('avail', {
			session: req.session
		});
	else
		res.redirect('/login');
	// res.render('avail/index');
});

router.post('/checkfilled', function (req, res) {
	var from = req.body.from;
	from = from.split("/");
	var to = req.body.to;
	to = to.split("/");
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');

		collection.find({
			"date": {
				$gte: from[2] + '-' + from[0] + '-' + from[1],
				$lte: to[2] + '-' + to[0] + '-' + to[1]
			}
		}).toArray(function (err, docs) {
			assert.equal(err, null);
			var jso;
			if (docs.length > 0)
				jso = {
					"d": "available"
				};
			else
				jso = {
					"d": "notavailable"
				};
			res.send(jso);
		});
		db.close();
	});
});

router.post('/getcat', function (req, res) {
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);

		var cursor = db.collection('common').find({}).project({
			catagories: 1,
			plans: 1,
			_id: 0
		});
		cat = [], pln = [];
		cursor.forEach(function (doc, err) {
			if (JSON.stringify(doc).localeCompare("{}") == -1) {
				for (i = 0; i < doc.catagories.length; i++) {
					cat.push(doc.catagories[i]);
				}
				for (i = 0; i < doc.plans.length; i++) {
					pln.push(doc.plans[i]);
				}
				var jso = {
					"catagories": cat,
					"plans": pln
				};
				res.send(jso);
			}
		});
		db.close();
	});
});

router.post('/insertavail', function (req, res) {
	/* chage date formate */
	var from = req.body.fromdate.split("/");
	from = from[2] + "-" + from[0] + "-" + from[1]
	var to = req.body.todate.split("/");
	to = to[2] + "-" + to[0] + "-" + to[1]
	fromd = new Date(from)
	tod = new Date(to)

	var Rooms = req.body.Rooms;
	var prom = req.body.PromoCode;
	var extrabed = req.body.extrabed;
	var plans = req.body.Plans;
	nights = 0;

	if (from.localeCompare(to) == 0) {
		nights = 1;
	} else {
		var timeDiff = Math.abs(tod.getTime() - fromd.getTime());
		var nights = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
	}
	docarr = [];

	for (i = 1; i <= nights; i++) {
		docarr.push({
			"date": from,
			"room": Rooms,
			"Extrabed": extrabed,
			"coupon": prom,
			"Plans": plans
		});

		var tomorrow = new Date(from);
		tomorrow.setDate(tomorrow.getDate() + 1);
		var dd = tomorrow.getDate();
		var mm = tomorrow.getMonth() + 1;
		var yyyy = tomorrow.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}
		if (mm < 10) {
			mm = '0' + mm
		}
		from = yyyy + '-' + mm + '-' + dd;
	}
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');
		collection.insertMany(docarr, function (err, result) {
			assert.equal(err, null);
			assert.equal(docarr.length, result.result.n);
			assert.equal(docarr.length, result.ops.length);
		});
		db.close();
		res.send({
			"res": "Success"
		});
	});
});

//return json of given date
router.post('/geteditdata', function (req, res) {
	/* change date formate */
	var edate = (req.body.edate).split("/");
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');
		collection.find({
			"date": edate[2] + "-" + edate[0] + "-" + edate[1]
		}).toArray(function (err, docs) {
			assert.equal(err, null);
			var jso = docs[0];
			res.send(jso);
		});
		db.close();
	});
});

//update Availibility
router.post('/updateavail', function (req, res) {
	console.log();
	var edate = req.body.edate.split("/");
	edate = edate[2] + "-" + edate[0] + "-" + edate[1];
	console.log(edate);
	var Rooms = req.body.Rooms;
	var prom = req.body.PromoCode;
	var extrabed = req.body.extrabed;
	var plans = req.body.Plans;
	console.log(Rooms + " " + prom + " " + plans);
	jso = {
		"date": edate,
		"room": Rooms,
		"Extrabed": extrabed,
		"coupon": prom,
		"Plans": plans
	}
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');
		collection.update({
			"date": edate
		}, {
			$set: jso
		}, function (err, result) {
			var resp;
			if (err) {
				resp = {
					"res": "failure"
				}
			} else {
				resp = {
					"res": "Success"
				}
			}
			res.send(resp);
			//do something.
		});
		db.close();
	});
});

module.exports = router;