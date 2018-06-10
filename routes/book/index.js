var express = require('express');
var router = express.Router();
// var mongo = require('mongodb');
var assert = require('assert');
var mongoUtil = require('../../bin/mongoUtil');
var fs = require('fs');
var pdf = require('html-pdf');
// var murl = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";
/*
 * Mail Fuctions
 */
'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'sanghanijignesh25@gmail.com', // generated ethereal user
            pass: '74053696989925532694' // generated ethereal password
        }
    });

/* GET users listing. */
router.get('/', function (req, res, next) {
	if (req.session.uid && req.session.email)
		res.render('book', {
			session: req.session
		});
	else
		res.redirect('/login');
	//   res.render('book/index');
});

router.post('/getavail', function (req, res) {
	/* change date formate */
	var chkin = (req.body.checkindate).split("/");
	var chkout = (req.body.checkoutdate).split("/");
	console.log(chkin[2] + "-" + chkin[0] + "-" + chkin[1]);
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
				$gte: chkin[2] + "-" + chkin[0] + "-" + chkin[1],
				$lt: chkout[2] + "-" + chkout[0] + "-" + chkout[1]
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

router.post('/getgstrate', function (req, res) {
	console.log("getgstrate");
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
	contact = req.body.contact;
	chkin = req.body.chkin;
	chkout = req.body.chkout;
	room = req.body.rooms;
	catagory = req.body.catagory;
	resp = "Failure";
	decr = (-1) * room;
	flag = false;
	days = req.body.nights;

	var resarr = [];
	mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({
			"contact": contact,
			"chkin": chkin,
			"chkout": chkout,
			"catagory": catagory
		}).toArray(function (err, docs) {
			db.close();
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
											console.log(req.body);
											console.log(dbresp["ops"][0]["_id"]);
											if (err) {
												resp = "Failure";
												throw err
											};
        									db.collection('contents').findOne({key: 'options'}, function (err, hname) {
												html_to_pdf(dbresp["ops"][0]["_id"], req.body,hname.general.name);
											});
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

												if 
													(err) resp = "Failure"
												else {	
													resp = "Success" 
												}
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

function html_to_pdf(id,body,hname) {
	var html = `
	<html>
	<head>
	    <meta charset="utf-8">
	    
	    
	    <style>
	    .invoice-box {
	        max-width: 800px;
	        margin: auto;
	        padding: 30px;
	        border: 1px solid #eee;
	        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
	        font-size: 16px;
	        line-height: 24px;
	        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
	        color: #555;
	    }
	    
	    .invoice-box table {
	        width: 100%;
	        line-height: inherit;
	        text-align: left;
	    }
	    
	    .invoice-box table td {
	        padding: 5px;
	        vertical-align: top;
	    }
	    
	    .invoice-box table tr td:nth-child(2) {
	        text-align: right;
	    }
	    
	    .invoice-box table tr.top table td {
	        padding-bottom: 20px;
	    }
	    
	    .invoice-box table tr.top table td.title {
	        font-size: 45px;
	        line-height: 45px;
	        color: #333;
	    }
	    
	    .invoice-box table tr.information table td {
	        padding-bottom: 40px;
	    }
	    
	    .invoice-box table tr.heading td {
	        background: #eee;
	        border-bottom: 1px solid #ddd;
	        font-weight: bold;
	    }
	    
	    .invoice-box table tr.details td {
	        padding-bottom: 20px;
	    }
	    
	    .invoice-box table tr.item td{
	        border-bottom: 1px solid #eee;
	    }
	    
	    .invoice-box table tr.item.last td {
	        border-bottom: none;
	    }
	    
	    .invoice-box table tr.total td:nth-child(2) {
	        border-top: 2px solid #eee;
	        font-weight: bold;
	    }
	    
	    @media only screen and (max-width: 600px) {
	        .invoice-box table tr.top table td {
	            width: 100%;
	            display: block;
	            text-align: center;
	        }
	        
	        .invoice-box table tr.information table td {
	            width: 100%;
	            display: block;
	            text-align: center;
	        }
	    }
	    
	    /** RTL **/
	    .rtl {
	        direction: rtl;
	        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
	    }
	    
	    .rtl table {
	        text-align: right;
	    }
	    
	    .rtl table tr td:nth-child(2) {
	        text-align: left;
	    }
	    </style>
	</head>

	<body>
	    <div class="invoice-box">
	        <table cellpadding="0" cellspacing="0">
	            <tr class="top">
	                <td colspan="2">
	                    <table>
	                        <tr>
	                            <td class="title">
	                                `+hname+`
	                            </td>
	                            
	                            <td>
	                                Invoice #: `+id+`<br>
	                                Invoice Date: `+body.chkout+`<br>
	                               
	                            </td>
	                        </tr>
	                    </table>
	                </td>
	            </tr>
	            
	            <tr class="information">
	                <td colspan="2">
	                    <table>
	                        <tr>
	                            <td>
	                                `+body.cname+`<br>
	                                `+body.contact+`<br>
	                                
	                            </td>
	                            
	                            
	                        </tr>
	                    </table>
	                </td>
	            </tr>
	            
	            <tr class="heading">
	                <td colspan="3">
	                    Payment Info
	                </td>
	                
	               
	            </tr>
	            
	            <tr class="details">
	                <td colspan="3">
	                    `+body.pmtinfo+`
	                </td>
	                
	               
	            </tr>
	            
	            <tr class="heading">
	                <td>
	                    Item
	                </td>
	                
	                <td>
	                    Quantity
	                </td>
	                <td>
	                    Price
	                </td>
	            </tr>
	            
	            <tr class="item">
	                <td>
	                    `+body.catagory+` Room
	                </td>
	                
	                <td>
	                    `+body.rooms+`
	                </td>
	                 <td>
	                    `+body.totroomcost+`
	                </td>
	            </tr>
	            
	            <tr class="item">
	                <td>
	                    `+body.plan+` Charges
	                </td>
	                
	                <td>
	                    -
	                </td>
	                 <td>
	                    `+body.plancharges+`
	                </td>
	            </tr>
	            
	            <tr class="item last">
	                <td>
	                    Extrabed Charges
	                </td>
	                <td>
	                    `+(parseInt(body.cwextrabed)+parseInt(body.cwoextrabed)+parseInt(body.exbed))+`
	                </td>
	                
	                <td>
	                    `+(parseInt(body.childwexcost)+parseInt(body.childwoexcost)+parseInt(body.extrabed))+`
	                </td>
	            </tr>
	            
	            <tr class="total">
	                <td></td>
	                <td>Total:</td>
	                
	                <td>
	                    `+body.tothotelcost+`
	                </td>
	            </tr>
	            <tr class="total">
	                <td></td>
	                <td>GST:</td>
	                
	                <td>
	                    `+body.totalgst+`
	                </td>
	            </tr>
	            <tr class="total">
	                <td></td>
	                <td>Grand Total:</td>
	                
	                <td>
	                    `+body.finalpr+`
	                </td>
	            </tr>
	        </table>
	    </div>
	</body>
	</html>
	`; //Some HTML String from code above
	
	var options = { format: 'Letter' };
	 
	pdf.create(html, options).toFile('./public/pdf/'+id+'.pdf', function(err, res) {
	  if (err) return console.log(err);
	  console.log(res); // { filename: '/app/businesscard.pdf' }
		  /* 
		  *Send Mail
		  */
		let mailOptions = {
	        from: '"Jignesh Sanghani 👻" <sanghanijignesh25@gmail.com>', // sender address
	        to: body.email, // list of receivers
	        subject: 'booking confirmation', // Subject line
	        html: `
					<html>
						<style>
							.container
							{
							   background-color:grey;
							   padding: 30px;
							   font-weight: bold;	
							}
							</style>
						<body>
							<h3>Congratulations <font color="red">`+body.cname+`</font></h3>
							<br><br><br>
							<font color="blue">Your booking of <b><font color="red">`+body.rooms+`</font></b> rooms from <b><font color="red">`+body.chkin+`</font></b> to <b><font color="red">`+body.chkout+`</font></b> is confirmed as below</font>.
						<div>
							<table class="container" align="center">
								<tr>
									<td>Category</td>
									<td>`+body.catagory+`</td>
								</tr>
								<tr>
									<td>Plan</td>
									<td>`+body.plan+`</td>
								</tr>
								<tr>
									<td>Extrabeds</td>
									<td>`+(parseInt(body.cwextrabed)+parseInt(body.cwoextrabed)+parseInt(body.exbed))+`</td>
								</tr>
								<tr>
									<td>Total</td>
									<td>`+body.tothotelcost+`</td>
								</tr>
								<tr>
									<td>GST</td>
									<td>`+body.totalgst+`</td>
								</tr>
								<tr>Total</tr>
								<td>`+body.finalpr+`</td>
							</table>
							</div>
						</body>
						</html>`, // html body
	         attachments:[{
		        filename: id+'.pdf',
		        path: './public/pdf/'+id+'.pdf',
		        contentType: 'application/pdf'
		    }]
	    };

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	            return console.log(error);
	        }
	    });
	});
}

module.exports = router;