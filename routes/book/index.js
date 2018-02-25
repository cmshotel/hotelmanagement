var express = require('express');
var router = express.Router();
// var mongo = require('mongodb');
var assert = require('assert');
var mongoUtil = require('../../bin/mongoutil');
// var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('book/index');
});

router.post('/getavail', function (req, res) {
	/* change date formate */
	var chkin = (req.body.checkindate).split("/");
	var chkout = (req.body.checkoutdate).split("/");
	console.log(chkin[2]+"-"+chkin[0]+"-"+chkin[1]);
	var room = req.body.norooms;
	// chin = new Date(chkin);
	// chout = new Date(chkout);
	// var oneDay = 24 * 60 * 60 * 1000;
	days = req.body.nights; /* Math.round(Math.abs((cho.getTime() - chi.getTime())/(oneDay))); */
	var resarr = [];
	
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var cursor = db.collection('avail').find({
			"date": {
				$gte: chkin[2]+"-"+chkin[0]+"-"+chkin[1],
				$lt: chkout[2]+"-"+chkout[0]+"-"+chkout[1]
			}
		});
		catarr = [];
		catname = [];
		catprice = [];
		plannames = [];
		plancount = [];
		finplans = [];
		planprice = [];
		finplanprices = [];
		count = 0;
		extrabedpr = 0;

		cursor.forEach(function (doc, err) {
			assert.equal(null, err);
			count++;
			extrabedpr += parseInt(doc.Extrabed);

			for (i = 0; i < doc.room.length; i++) {
				//chceck if available rooms are greaterthan needed room
				if (parseInt(doc.room[i].available) >= room) {
					//get the new catagory that is not identified earlier
					if (catname.indexOf(doc.room[i].catagory) <= -1) {
						catname.push(doc.room[i].catagory);
						catarr.push(1);
						catprice.push(parseInt(doc.room[i].price));
					} else {
						//if catagory has identified earlier then increase night count of that catagory and roomprice also increase
						catarr[catname.indexOf(doc.room[i].catagory)] += 1;
						catprice[catname.indexOf(doc.room[i].catagory)] += parseInt(doc.room[i].price);
					}
				}
			}
			for (i = 0; i < doc.Plans.length; i++) {
				if (plannames.indexOf(doc.Plans[i].name) <= -1) {
					plannames.push(doc.Plans[i].name);
					plancount.push(1);
					planprice.push(parseInt(doc.Plans[i].price));
				} else {
					plancount[plannames.indexOf(doc.Plans[i].name)] += 1;
					planprice[plannames.indexOf(doc.Plans[i].name)] += parseInt(doc.Plans[i].price)
				}
			}

		}, function () {
			for (i = 0; i < plannames.length; i++) {
				if (plancount[i] == days) {
					finplans.push(plannames[i]);
					finplanprices.push(planprice[i]);
				}
			}

			for (i = 0; i < catarr.length; i++) {
				//if we found that perticular catagory's nights are available for required nights
				rp = parseFloat(catprice[i]) / parseFloat(days)
				if (catarr[i] == days) {
					resarr.push({
						"catagory": catname[i],
						"roomprice": Math.round(rp * 100) / 100,
						"price": catprice[i] * room
					});
				}
			}
			assert.equal(null, err);
			jso = {
				"jsa": resarr,
				"plans": {
					"plannames": finplans,
					"planprices": finplanprices
				},
				"ebedprice": parseFloat(extrabedpr)
			}
			db.close();
			console.log(jso);
			res.send(jso);
		});

	});
});

router.post('/getgstrate', function (req, res) {
	roompr = req.body.roompr;
	stayrate = 0;
	foodrate = 0;
	empty = {};

	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		var cursor = db.collection('common').find({}).project({
			gst: 1,
			_id: 0
		});
		cursor.forEach(function (doc, err) {
			if (JSON.stringify(doc).localeCompare("{}") == -1) {
				//for stay gst rate
				for (i = 0; i < doc.gst[0].stayslabs.length; i++) {
					x = doc.gst[0].stayslabs[i].range;
					if (x.indexOf("-") > -1) {
						y = x.split("-")

						if ((parseFloat(roompr) >= parseFloat(y[0])) && (parseFloat(roompr) <= parseFloat(y[1]))) {
							stayrate = doc.gst[0].stayslabs[i].rate;

						}
					} else {
						if (parseFloat(roompr) >= parseFloat(x)) {

							stayrate = doc.gst[0].stayslabs[i].rate;


						}
					}
				}

				//for food gst rate
				foodrate = doc.gst[1].foodslabs[0].rate;
			}
			assert.equal(null, err);
		}, function () {

			assert.equal(null, err);
			db.close();
			res.send({
				"stayrate": stayrate,
				"foodrate": foodrate
			});
		});

	});
});

router.post('/dobooking', function (req, res) {
	// while (bookingprocess == 1) {
	// 	// sleep.sleep(1)
	// }

	bookingprocess = 1;
	contact = req.body.contact
	chkin = req.body.chkin
	chkout = req.body.chkout
	room = req.body.rooms
	catagory = req.body.catagory
	resp = "Failure"
	decr = (-1) * room
	flag = false;

	//check availability again
	chin = new Date(chkin);
	chout = new Date(chkout);
	days = chout.getDate() - chin.getDate();
	var resarr = [];

	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({
			"contact": contact,
			"chkin": chkin,
			"chkout": chkout,
			"catagory": catagory
		}).toArray(function (err, docs) {
			db.close()
			if (docs.length != 0) {
				res.send({
					"response": "available"
				})
			} else {
				mongoUtil.connectToServer(function (err, db) {
					assert.equal(null, err);
					var cursor = db.collection('avail').find({
						"date": {
							$gte: chkin,
							$lt: chkout
						}
					});

					catarr = [];
					catname = [];
					cursor.forEach(function (doc, err) {
						assert.equal(null, err);

						for (i = 0; i < doc.room.length; i++) {
							//chceck if available rooms are greaterthan needed room
							if (parseInt(doc.room[i].available) >= room) {
								//get the new catagory that is not identified earlier
								if (catname.indexOf(doc.room[i].catagory) <= -1) {
									catname.push(doc.room[i].catagory);
									catarr.push(1);
								} else {
									//if catagory has identified earlier then increase night count of that catagory and roomprice also increase
									catarr[catname.indexOf(doc.room[i].catagory)] += 1;
								}
							}
						}
					}, function () {
						db.close();
						for (i = 0; i < catarr.length; i++) {
							if (catarr[i] == days) {
								if (catname[i].localeCompare(catagory) == 0) {
									flag = true;
									//insertion of booking
									//db.collection('booking').insertOne(req.body);
									mongoUtil.connectToServer(function (err, db) {
										assert.equal(null, err);
										db.collection("booking").insertOne(req.body, function (err, dbresp) {
											if (err) {
												resp = "Failure";
												throw err
											};
											db.close();
										});
										mongoUtil.connectToServer(function (err, db) {
											assert.equal(null, err);
											db.collection("avail").update({
												"date": {
													$gte: chkin,
													$lt: chkout
												},
												"room.catagory": catagory
											}, {
												$inc: {
													"room.$.available": decr
												}
											}, {
												"multi": true
											}, function (err, doc) {

												if (err) resp = "Failure"
												else resp = "Success"
												db.close();
												bookingprocess = 0;
												res.send({
													"response": resp
												});
											});
										});
									})
								}
							}
						}
						if (flag == false) {
							bookingprocess = 0;
							res.send({
								"response": resp
							});
						}
					});
				});
			}
		});
	});
});

module.exports = router;
