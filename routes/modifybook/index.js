var assert = require('assert');
var mongo = require('mongodb');
//var murl = "mongodb://admin:admin@ds141796.mlab.com:41796/cms";
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var mongoUtil = require('../../bin/mongoUtil');




/* GET users listing. */
router.get('/', function(req, res, next) {
	if (req.session.uid && req.session.email)
		res.render('modifybook/index', {
			session: req.session
		});
	else
		res.redirect('/login');
});

/*
*gives suggestion for email id
*/

router.post('/getsuggestion', function(req, res, next) {
	key=req.body.keyword
mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({"email": new RegExp(key)},{"email":1}).toArray(function(err,docs){
			jso=[];
			for(i=0;i<docs.length;i++){
				if(jso.indexOf(docs[i].email)== -1){jso.push(docs[i].email);}
		
			}
			res.send(jso);
		})
	});
});

/*
*responses booking list of perticular emnail id
*/
router.post('/listofbookings', function(req, res, next) {
	key=req.body.keyword
 mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({"email": key},{"_id":1,"cname":1,"rooms":1,"bookdate":1,"nights":1,"chkin":1,"catagory":1,"status":1}).sort({"bookdate":-1}).toArray(function(err,docs){
			jso=[];
			for(i=0;i<docs.length;i++){
				jso.push(docs[i])
			}
			res.send(jso);
		})
	});
});

router.post('/fetchfullinfo', function(req, res, next) {
	key=req.body.keyword	
 mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('booking').find({"_id": ObjectId(key)}).toArray(function(err,docs){
			
			if(err){}
				else{
			res.send(docs[0]);}
		})
	});
});



router.post('/coreupdatecheck', function(req, res, next) {
	old_json=req.body.old;
	new_json=req.body.new;	
	
	checkin_change=false;
	checkout_change=false;
	category_change=false;
	plan_change=false;
	rooms_change=false;
	available=false;
	notavailablearr=[];
	if(old_json.chkin.localeCompare(new_json.chkin)!=0){
		checkin_change=true;
	}
	if(old_json.chkout.localeCompare(new_json.chkout)!=0){
		checkout_change=true;
	}
	if(old_json.catagory.localeCompare(new_json.catagory)!=0){
		category_change=true;
	}

	if(old_json.plan.localeCompare(new_json.plan)!=0){
		plan_change=true;
	}

	if(old_json.rooms!=new_json.rooms){
		rooms_change=true;
	}
	

	/*if category changed 
	*/
	if(category_change){
		cat=new_json.catagory
		roms=new_json.rooms
		chin=new_json.chkin
		chout=new_json.chkout
		plan=new_json.plan
		
		nights=new_json.nights; 
		

		mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('avail').find({
			"date": {
				$gte: chin,
				$lt: chout
			}
		}).toArray(function(err,docs){
			nightcount=0;
			plancount=0;
			planpr=0;
			catpr=0;
			exbedpr=0;


			if(docs.length==nights){
			for(i=0;i<docs.length;i++){
				exbedpr+=parseInt(docs[i].Extrabed)
				for(j=0;j<docs[i].room.length;j++){
					if(docs[i].room[j].catagory.localeCompare(cat)==0 && docs[i].room[j].available>=roms){
						catpr+=parseInt(docs[i].room[j].price)
						nightcount++;
						break;
					}
				}
				for(j=0;j<docs[i].Plans.length;j++){
					if(docs[i].Plans[j].name.localeCompare(plan)==0){
						planpr+=(docs[i].Plans[j].price)
						plancount++;
						break;
					}
				}
			}
			if(nightcount!=nights){		
			notavailablearr.push('Rooms');			
			}
			if(plancount!=nights){
						notavailablearr.push('Plan');	

			}
			if(nightcount==nights && plancount==nights){
				catpr=catpr/nights
				planpr=planpr/nights
				exbedpr=exbedpr/nights
				available=true;
				
				
			}
			ret={"available":available,"notavailable":notavailablearr,"categorypr":catpr,"planpr":planpr,"extrabedpr":exbedpr};
				res.send(ret) ;

		}
		});
		});

	}
	/*
	if category not changed then
	*/
	else{

		if(checkin_change || checkout_change || rooms_change){
			new_dates=[]
			new_rooms=[]
			old_dates=[]
			old_rooms=[]
			rooms_required=[]
			temp_rooms=parseInt(new_json.rooms)
			
			var nextDay = new Date(new_json.chkin);		
			while(nextDay < new Date(new_json.chkout)){		
			//correct date format		

				new_dates.push(new Date(nextDay));
				new_rooms.push(temp_rooms);
				rooms_required.push(temp_rooms);
				nextDay.setDate(nextDay.getDate()+1);			
			}
	
			temp_rooms=parseInt(old_json.rooms);
			nextDay = new Date(old_json.chkin);		

			while(nextDay< new Date(old_json.chkout)){				
				old_dates.push(new Date(nextDay));
				old_rooms.push(temp_rooms);
				nextDay.setDate(nextDay.getDate()+1);			
			}
				
				
			for(i=0;i<old_dates.length;i++){
				temp=old_dates[i];

				for(j=0;j<new_dates.length;j++){
					
					if(+temp == +new_dates[j]){

						new_rooms[j]=new_rooms[j]-old_rooms[i];
						if(new_rooms[j]<=0){
							rooms_required[j]=0;
						}else{
							rooms_required[j]=new_rooms[j];
						}
						break;
					}
				}

			}
			


			mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
				db.collection('avail').find({
					"date": {
						$gte: new_json.chkin,
						$lt: new_json.chkout
					}
				}).toArray(function(err,docs){
					
					count=0;
					ind=0;
					plancount=0;
					planpr=0;
					exbedpr=0;
					
					//count new availablity
					for(i=0;i<docs.length;i++){
						exbedpr+=parseInt(docs[i].Extrabed)
						temp_date=new Date(docs[i].date);
						//find index of current document date from new dates array
						for(k=0;k<new_dates.length;k++){
							if(+new_dates[i]== +temp_date){
								ind=i;
								break;
							}
						}
						//get categorywise count++
						for(j=0;j<docs[i].room.length;j++){
							if(docs[i].room[j].catagory.localeCompare(new_json.catagory)==0 && docs[i].room[j].available>=rooms_required[ind]){
								
									count++;
									break;
								
							}
						}
						for (l=0;l<docs[i].Plans.length;l++){
							if(docs[i].Plans[l].name.localeCompare(new_json.plan)==0){
								plancount++;
								planpr+=(docs[i].Plans[l].price)
							}
						}
					}
					if(count==new_dates.length && plancount==new_dates.length){
						available=true;
						planpr=planpr/parseInt(new_json.nights);
						exbedpr=exbedpr/parseInt(new_json.nights);

					}
					if(count!=new_dates.length){
						notavailablearr.push('Rooms')
					}
					if(plancount!=new_dates.length){
						notavailablearr.push('Plan')
					}
					ret={"available":available,"notavailable":notavailablearr,"categorypr":old_json.roomprice,"planpr":planpr,"extrabedpr":exbedpr};
					res.send(ret) ;

				});

			});


		}
		else{
			if(plan_change){

			mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
				db.collection('avail').find({
					"date": {
						$gte: new_json.chkin,
						$lt: new_json.chkout
					}
				}).toArray(function(err,docs){
					
					
					plancount=0;
					planpr=0;
					exbedpr=0
					
					//count new availablity
					for(i=0;i<docs.length;i++){
						exbedpr+=parseInt(docs[i].Extrabed)
						
						for (l=0;l<docs[i].Plans.length;l++){
							if(docs[i].Plans[l].name.localeCompare(new_json.plan)==0){
								plancount++;
								planpr+=(docs[i].Plans[l].price)
							}
						}
					}
					if(plancount==new_json.nights){
						available=true;
						planpr=planpr/parseInt(new_json.nights)
						exbedpr=exbedpr/parseInt(new_json.nights)
					}
					if(plancount!=new_json.nights){
						notavailablearr.push('Plan');
					}
					ret={"available":available,"notavailable":notavailablearr,"categorypr":old_json.roomprice,"planpr":planpr,"extrabedpr":exbedpr};
					res.send(ret) ;
				});
			});

			}
			else{
				available=true;
				

				ret={"available":available,"notavailable":notavailablearr,"categorypr":old_json.roomprice,"planpr":old_json.planpr,"extrabedpr":"old"};
					res.send(ret) ;

			}
		}


	}




});


router.post('/cancelbooking', function(req, res, next) {
	bid=req.body.bookid;
	

	mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
				db.collection('booking').updateOne({"_id": ObjectId(bid)},{"$set" : {"status":"cancelled"}},function(err,resul){
					if(err){ans={"resp":false};}
						else{ans={"resp":true};}
						mongoUtil.connectToServer(function (err, db) {
								assert.equal(null, err);
								db.collection('booking').find({"_id": ObjectId(bid)}).toArray(function(err,docs){
									
									chin=docs[0].chkin
									chout=docs[0].chkout
									rooms=parseInt(docs[0].rooms);
									catagory=docs[0].catagory;

									mongoUtil.connectToServer(function (err, db) {
											assert.equal(null, err);
											db.collection("avail").update({
												"date": {
													$gte: chin,
													$lt: chout
												},
												"room.catagory": catagory
											}, {
												$inc: {
													"room.$.available": rooms
												}
											}, {
												"multi": true
											}, function (err, doc) {

												if (err) resp = false
												else resp = true
													res.send({"resp":resp})
											})
										})





								})
							})


					//res.send(ans);
					


				});
			});
});


router.post('/makecoreupdate', function(req, res, next) {
	
	old_json=req.body.ojson
	new_json=req.body.njson
	nid=req.body.nid
		

	checkin_change=false;
	checkout_change=false;
	category_change=false;
	plan_change=false;
	rooms_change=false;
	available=false;
	notavailablearr=[];
	if(old_json.chkin.localeCompare(new_json.chkin)!=0){
		checkin_change=true;
	}
	if(old_json.chkout.localeCompare(new_json.chkout)!=0){
		checkout_change=true;
	}
	if(old_json.catagory.localeCompare(new_json.catagory)!=0){
		category_change=true;
	}

	if(old_json.plan.localeCompare(new_json.plan)!=0){
		plan_change=true;
	}

	if(old_json.rooms!=new_json.rooms){
		rooms_change=true;
	}
	

	/*if category changed 
	*/
	if(category_change){
		cat=new_json.catagory
		roms=new_json.rooms
		chin=new_json.chkin
		chout=new_json.chkout
		plan=new_json.plan
		
		nights=new_json.nights; 
		

		mongoUtil.connectToServer(function (err, db) {
		assert.equal(null, err);
		db.collection('avail').find({
			"date": {
				$gte: chin,
				$lt: chout
			}
		}).toArray(function(err,docs){
			nightcount=0;
			plancount=0;
			planpr=0;
			catpr=0;
			exbedpr=0;


			if(docs.length==nights){
			for(i=0;i<docs.length;i++){
				exbedpr+=parseInt(docs[i].Extrabed)
				for(j=0;j<docs[i].room.length;j++){
					if(docs[i].room[j].catagory.localeCompare(cat)==0 && docs[i].room[j].available>=roms){
						catpr+=parseInt(docs[i].room[j].price)
						nightcount++;
						break;
					}
				}
				for(j=0;j<docs[i].Plans.length;j++){
					if(docs[i].Plans[j].name.localeCompare(plan)==0){
						planpr+=(docs[i].Plans[j].price)
						plancount++;
						break;
					}
				}
			}
			if(nightcount!=nights){		
			notavailablearr.push('Rooms');			
			}
			if(plancount!=nights){
						notavailablearr.push('Plan');	

			}
			if(nightcount==nights && plancount==nights){
				catpr=catpr/nights
				planpr=planpr/nights
				exbedpr=exbedpr/nights
				available=true;
				ret={"success":false};
				
				
			}
			if(!available){res.send(ret) ;}
					else{
						/*release rooms on availability
						*/
						mongoUtil.connectToServer(function (err, db) {
								assert.equal(null, err);
								

									mongoUtil.connectToServer(function (err, db) {
											assert.equal(null, err);
											db.collection("avail").update({
												"date": {
													$gte: old_json.chkin,
													$lt: old_json.chkout
												},
												"room.catagory": old_json.catagory
											}, {
												$inc: {
													"room.$.available": old_json.rooms
												}
											}, {
												"multi": true
											}, function (err, doc) {

												if (err) resp = false
												else resp = true
													// res.send({"resp":resp})
												db.close()
												if(resp){
													/*aquire rooms
													*/
												mongoUtil.connectToServer(function (err, db) {
														assert.equal(null, err);
														
															
															aquirerooms=-new_json.rooms

															mongoUtil.connectToServer(function (err, db) {
																	assert.equal(null, err);
																	db.collection("avail").update({
																		"date": {
																			$gte: new_json.chkin,
																			$lt: new_json.chkout
																		},
																		"room.catagory": new_json.catagory
																	}, {
																		$inc: {
																			"room.$.available": aquirerooms
																		}
																	}, {
																		"multi": true
																	}, function (err, doc) {

																		if (err) resp = false
																		else resp = true
																			if(resp){
																				mongoUtil.connectToServer(function (err, db) {
																					assert.equal(null, err);
																				db.collection('booking').updateOne({"_id": ObjectId(nid)},{"$set" : new_json},function(err,resul){
																						if(err){ans={"success":false}}
																							else{ans={"success":true};}
																						res.send(ans);
																					});
																			});

																			}
																	})
																})





														
														db.close()
													})
										}


											})
										})





								
							})

					}

		}
		});
		});

	}
	/*
	if category not changed then
	*/
	else{

		if(checkin_change || checkout_change || rooms_change){
			new_dates=[]
			new_rooms=[]
			old_dates=[]
			old_rooms=[]
			rooms_required=[]
			temp_rooms=parseInt(new_json.rooms)
			
			var nextDay = new Date(new_json.chkin);		
			while(nextDay < new Date(new_json.chkout)){		
			//correct date format		

				new_dates.push(new Date(nextDay));
				new_rooms.push(temp_rooms);
				rooms_required.push(temp_rooms);
				nextDay.setDate(nextDay.getDate()+1);			
			}
	
			temp_rooms=parseInt(old_json.rooms);
			nextDay = new Date(old_json.chkin);		

			while(nextDay< new Date(old_json.chkout)){				
				old_dates.push(new Date(nextDay));
				old_rooms.push(temp_rooms);
				nextDay.setDate(nextDay.getDate()+1);			
			}
				
				
			for(i=0;i<old_dates.length;i++){
				temp=old_dates[i];

				for(j=0;j<new_dates.length;j++){
					
					if(+temp == +new_dates[j]){

						temp=new_rooms[j]-old_rooms[i];

						if(temp<=0){
							rooms_required[j]=0;
						}else{
							rooms_required[j]=new_rooms[j];
						}
						break;
					}
				}

			}
			
			


			mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
				db.collection('avail').find({
					"date": {
						$gte: new_json.chkin,
						$lt: new_json.chkout
					}
				}).toArray(function(err,docs){
					
					count=0;
					ind=0;
					plancount=0;
					planpr=0;
					exbedpr=0;
					
					//count new availablity
					for(i=0;i<docs.length;i++){
						exbedpr+=parseInt(docs[i].Extrabed)
						temp_date=new Date(docs[i].date);
						//find index of current document date from new dates array
						for(k=0;k<new_dates.length;k++){
							if(+new_dates[i]== +temp_date){
								ind=i;
								break;
							}
						}
						//get categorywise count++
						for(j=0;j<docs[i].room.length;j++){
							if(docs[i].room[j].catagory.localeCompare(new_json.catagory)==0 && docs[i].room[j].available>=rooms_required[ind]){
								
									count++;
									break;
								
							}
						}
						for (l=0;l<docs[i].Plans.length;l++){
							if(docs[i].Plans[l].name.localeCompare(new_json.plan)==0){
								plancount++;
								planpr+=(docs[i].Plans[l].price)
							}
						}
					}
					if(count==new_dates.length && plancount==new_dates.length){
						available=true;
						planpr=planpr/parseInt(new_json.nights);
						exbedpr=exbedpr/parseInt(new_json.nights);

					}
					if(count!=new_dates.length){
						notavailablearr.push('Rooms')
					}
					if(plancount!=new_dates.length){
						notavailablearr.push('Plan')
					}
					ret={"success":false};
					if(!available){res.send(ret) ;}
					else{
						/*release rooms on availability
						*/
						mongoUtil.connectToServer(function (err, db) {
								assert.equal(null, err);
								

									mongoUtil.connectToServer(function (err, db) {
											assert.equal(null, err);
											db.collection("avail").update({
												"date": {
													$gte: old_json.chkin,
													$lt: old_json.chkout
												},
												"room.catagory": old_json.catagory
											}, {
												$inc: {
													"room.$.available": old_json.rooms
												}
											}, {
												"multi": true
											}, function (err, doc) {

												if (err) resp = false
												else resp = true
													// res.send({"resp":resp})
												db.close()
												if(resp){
													/*aquire rooms
													*/
												mongoUtil.connectToServer(function (err, db) {
														assert.equal(null, err);
														
															
															aquirerooms=-new_json.rooms

															mongoUtil.connectToServer(function (err, db) {
																	assert.equal(null, err);
																	db.collection("avail").update({
																		"date": {
																			$gte: new_json.chkin,
																			$lt: new_json.chkout
																		},
																		"room.catagory": new_json.catagory
																	}, {
																		$inc: {
																			"room.$.available": aquirerooms
																		}
																	}, {
																		"multi": true
																	}, function (err, doc) {

																		if (err) resp = false
																		else resp = true
																			if(resp){
																				mongoUtil.connectToServer(function (err, db) {
																					assert.equal(null, err);
																				db.collection('booking').updateOne({"_id": ObjectId(nid)},{"$set" : new_json},function(err,resul){
																						if(err){ans={"success":false}}
																							else{ans={"success":true};}
																						res.send(ans);
																					});
																			});

																			}
																	})
																})





														
														db.close()
													})
										}


											})
										})





								
							})

					}

				});

			});


		}
		else{
			if(plan_change){

			mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
				db.collection('avail').find({
					"date": {
						$gte: new_json.chkin,
						$lt: new_json.chkout
					}
				}).toArray(function(err,docs){
					
					
					plancount=0;
					planpr=0;
					exbedpr=0
					
					//count new availablity
					for(i=0;i<docs.length;i++){
						exbedpr+=parseInt(docs[i].Extrabed)
						
						for (l=0;l<docs[i].Plans.length;l++){
							if(docs[i].Plans[l].name.localeCompare(new_json.plan)==0){
								plancount++;
								planpr+=(docs[i].Plans[l].price)
							}
						}
					}
					if(plancount==new_json.nights){
						available=true;
						planpr=planpr/parseInt(new_json.nights)
						exbedpr=exbedpr/parseInt(new_json.nights)
					}
					if(plancount!=new_json.nights){
						notavailablearr.push('Plan');
					}
					ret={"available":available,"notavailable":notavailablearr,"categorypr":old_json.roomprice,"planpr":planpr,"extrabedpr":exbedpr};
					if(available){
					mongoUtil.connectToServer(function (err, db) {
							assert.equal(null, err);
						db.collection('booking').updateOne({"_id": ObjectId(nid)},{"$set" : new_json},function(err,resul){
								if(err){ans={"success":false}}
									else{ans={"success":true};}
								res.send(ans);
							});
					});
				}
				else{
					res.send({"success":false});
				}
				});
			});

			}
			else{
				available=true;
				

				ret={"available":available,"notavailable":notavailablearr,"categorypr":old_json.roomprice,"planpr":old_json.planpr,"extrabedpr":"old"};
					if(available){
					mongoUtil.connectToServer(function (err, db) {
							assert.equal(null, err);
						db.collection('booking').updateOne({"_id": ObjectId(nid)},{"$set" : new_json},function(err,resul){
								if(err){ans={"success":false}}
									else{ans={"success":true};}
								res.send(ans);
							});
					});
				}
				else{
					res.send({"success":false});
				}

			}
		}


	}











});

router.post('/otherupdate', function(req, res, next) {
	
	id=req.body.oid
	updated=req.body.updated
		mongoUtil.connectToServer(function (err, db) {
				assert.equal(null, err);
	db.collection('booking').updateOne({"_id": ObjectId(id)},{"$set" : updated},function(err,resul){
					if(err){ans={"success":false}}
						else{ans={"success":true};}
					res.send(ans);
				});
});

});



module.exports = router;
