var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require("body-parser");
var assert = require('assert');

// var sleep = require('sleep');
var murl = "mongodb://admin:admin@ds141796.mlab.com:41796/cms";
// var murl = "mongodb://localhost:27017/cms";
app.use(bodyParser.json());
var port = process.env.PORT || 1200;
//var port=8000
app.listen(port);
/*
 *http server 
 */
/*var server = require('http').createServer(app);
server.listen(PORT, function() {
console.log('Express is running on port…3000 ');
});*/

/*
 *serving all static file
 */

app.use(express.static(path.join(__dirname, 'vendors')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'views'))); 


/*index.ejs request handling*/
app.set('view engine', 'ejs');


/*
 *idnex page request*/
app.get('/', function (req, res) {
	res.render(__dirname + '/views/index.ejs');
	console.log("/views/index.ejs");
});


/*
 *Booking 
 */

app.get('/avibility', function (req, res) {
	res.render(__dirname + '/views/avibility/index.ejs');
	console.log("/avibility");
});
//*******************************//
/*=>Handle all avibility request here
	To return Server date
*/
//******************************//

app.post('/checkfilled', function (req, res) {
	var from = req.body.from;
	var to = req.body.to;
	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');

		collection.find({
			"date": {
				$gte: from,
				$lte: to
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

app.post('/getcat', function (req, res) {
	mongo.connect(murl, function (err, db) {
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

//insert availibility
app.post('/insertavail', function (req, res) {
	var from = req.body.fromdate;
	var to = req.body.todate;
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
	mongo.connect(murl, function (err, db) {
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
app.post('/geteditdata', function (req, res) {
	var edate = req.body.edate;
	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		var collection = db.collection('avail');
		collection.find({
			"date": edate
		}).toArray(function (err, docs) {
			assert.equal(err, null);
			var jso = docs[0];
			res.send(jso);
		});
		db.close();
	});
});

//update Availibility
app.post('/updateavail', function (req, res) {
	var edate = req.body.edate;
	var Rooms = req.body.Rooms;
	var prom = req.body.PromoCode;
	var extrabed = req.body.extrabed;
	var plans = req.body.Plans;

	jso = {
		"date": edate,
		"room": Rooms,
		"Extrabed": extrabed,
		"coupon": prom,
		"Plans": plans
	}
	mongo.connect(murl, function (err, db) {
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


app.get('/booking', function (req, res) {
	res.render(__dirname + '/views/booking/index.ejs');
	console.log("/booking/index.ejs");
});
//*******************************//
/*=>Handle all booking request here
	To return Server date
*/
//******************************//
bookingprocess = 0;
//console.log(config.getLink());
app.post('/getavail', function (req, res) {
	var chkin = req.body.checkindate;
	var chkout = req.body.checkoutdate;
	var room = req.body.norooms;
	console.log(chkin+" "+chkout+" "+room)

	chin = new Date(chkin);
	chout = new Date(chkout);
	var oneDay = 24*60*60*1000;
	days = req.body.nights;/* Math.round(Math.abs((cho.getTime() - chi.getTime())/(oneDay))); */
	var resarr = [];
	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		var cursor = db.collection('avail').find({
			"date": {
				$gte: chkin,
				$lt: chkout
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
			res.send(jso);
		});

	});
});

app.post('/getgstrate', function (req, res) {
	roompr = req.body.roompr;
	stayrate = 0;
	foodrate = 0;
	empty = {};

	mongo.connect(murl, function (err, db) {
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

app.post('/dobooking', function (req, res) {
	while (bookingprocess == 1) {
		// sleep.sleep(1)
	}

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

	mongo.connect(murl, function (err, db) {
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
				mongo.connect(murl, function (err, db) {
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
									mongo.connect(murl, function (err, db) {
										assert.equal(null, err);
										db.collection("booking").insertOne(req.body, function (err, dbresp) {
											if (err) {
												resp = "Failure";
												throw err
											};
											db.close();
										});
										mongo.connect(murl, function (err, db) {
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

//edit form catagory available in selected dates
app.post('/getcatagory', function (req, res) {
	var chkin = req.body.chkin;
	var chkout = req.body.chkout;
	chin = new Date(chkin);
	chout = new Date(chkout);
	days = chout.getDate() - chin.getDate();
	var catlist = [];
	var planlist = [];

	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		db.collection('avail').find({
			"date": {
				$gte: chkin,
				$lt: chkout
			}
		}).toArray(function (err, docs) {
			assert.equal(null, err);
			for (i = 0; i < docs.length; i++) {
				for (j = 0; j < docs[i].room.length; j++) {
					if (catlist.indexOf(docs[i].room[j].catagory) == -1) {
						catlist.push(docs[i].room[j].catagory)
					}
				}
				for (j = 0; j < docs[i].Plans.length; j++) {
					if (planlist.indexOf(docs[i].Plans[j].name) == -1) {
						planlist.push(docs[i].Plans[j].name)
					}
				}
			}
			db.close()
			res.send({
				"catlist": catlist,
				"planlist": planlist
			});
		});
	});
});

//suggest contact number in edit form
app.post('/contectsuggest', function (req, res) {
	var chkin = req.body.chkin;
	var chkout = req.body.chkout;
	var cont = req.body.contact;
	var cat = req.body.catagory;
	var contlist = [];

	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({
			"contact": new RegExp(cont),
			"chkin": chkin,
			"chkout": chkout,
			"catagory": cat
		}).toArray(function (err, docs) {
			assert.equal(null, err);
			for (i = 0; i < docs.length; i++) {
				if (contlist.indexOf(docs[i].contact) == -1) {
					contlist.push(docs[i].contact)
				}
			}
			db.close()
			res.send({
				"contlist": contlist
			});
		});
	});
});


//info for perticular doc
app.post('/getinfo', function (req, res) {
	var chkin = req.body.chkin;
	var chkout = req.body.chkout;
	var cont = req.body.contact;
	var cat = req.body.catagory;

	mongo.connect(murl, function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({
			"contact": cont,
			"chkin": chkin,
			"chkout": chkout,
			"catagory": cat
		}).toArray(function (err, docs) {
			assert.equal(null, err);
			db.close()
			res.send(docs[0]);
		});
	});
});







app.get('/history', function (req, res) {
	res.render(__dirname + '/views/booking/view.ejs');
	console.log("/history");
});
/* 
*Return jsonformate of all the details
 */
app.post('/getBookedData',function(req,res){
	mongo.connect(murl, function(err, db) {
			assert.equal(null, err);
			collection=db.collection("booking");
			  collection.find().limit(20).toArray(function(err, docs) {
  
				jso=[];
				
				for(i=0;i<docs.length;i++){
				  	book=docs[i];
				  jso[i]={
					  	_id: docs[i]["_id"],
						cname:docs[i]["cname"],
						contact:docs[i]["contact"],
						email:docs[i]["email"],
						bookdate:docs[i]["bookdate"],
						rooms:docs[i]["rooms"],
						chkin:docs[i]["chkin"],
						chkout:docs[i]["chkout"],
						nights:docs[i]["nights"],
						catagory:docs[i]["catagory"],
						plan:docs[i]["plan"],
						exbed:docs[i]["exbed"],
						cwextrabed:docs[i]["cwextrabed"],
						cwoextrabed:docs[i]["cwoextrabed"],
						roomprice:docs[i]["roomprice"],
						totroomcost:docs[i]["totroomcost"],
						plancharges:docs[i]["plancharges"],
						extrabed:docs[i]["extrabed"],
						childwexcost:docs[i]["childwexcost"],
						childwoexcost:docs[i]["childwoexcost"],
						tothotelcost:docs[i]["tothotelcost"],
						staygstrate:docs[i]["staygstrate"],
						foodgstrate:docs[i]["foodgstrate"],
						staygst:docs[i]["staygst"],
						foodgst:docs[i]["foodgst"],
						totalgst:docs[i]["totalgst"],
						finalpr:docs[i]["finalpr"],
						amtpaid:docs[i]["amtpaid"],
						pmtinfo:docs[i]["pmtinfo"],
						status:docs[i]["status"],
					}
				}
				jso = JSON.parse(JSON.stringify({"data":jso}));
				console.log(jso);
				res.send(jso);
			  });
		});
  
  });

app.post('/getview', function (req, res) {
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

/*to give calender checkins of perticular date*/
app.post('/getcheckins', function (req, res) {
	chkind=req.body.chkindate;
		mongo.connect(murl, function (err, db) {
			assert.equal(null, err);
			db.collection('booking').find({	"chkin": chkind},{"_id":1,"cname":1,"chkout":1}).toArray(function (err, docs) {
				assert.equal(null, err);
				db.close()
				res.send(docs);
			});
		});
});




/*common request*/

app.post('/getdate', function (req, res) {
	res.send(new Date());
});

/*
 *websire lauout design
 */

app.get('/theme', function (req, res) {
	res.render(__dirname + '/views/editor/blank.ejs');
});


/*
 *Chart geneation
 */

app.get('/charts', function (req, res) {
	res.render(__dirname + '/views/index.ejs');
});


/*
 *Handling All settings request
 */

app.get('/setting/users', function (req, res) {
	res.render(__dirname + '/views/index.ejs');
});

app.get('/setting/database', function (req, res) {
	res.render(__dirname + '/views/index.ejs');
});
