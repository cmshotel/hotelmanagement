var express = require('express');
var router = express.Router();
// var mongo = require('mongodb');
var assert = require('assert');
var mongoUtil = require('../../bin/mongoUtil');


router.get('/', function (req, res, next) {
    if (req.session.uid && req.session.email)
        res.render('charts', {
            session: req.session
        });
    else
        res.redirect('/login');
    //   res.render('book/index');
});





router.post('/getbardata', function (req, res, next) {

start=req.body.start
end=req.body.end
months=req.body.months

jsa=[];
month=new Date(start).getMonth()+1
year=new Date(start).getFullYear()

for(i=0;i<months;i++){
	jsa.push({"month":month+"-"+year,"rooms":0});
  if(month==12){
    year++;
    month=0;
  }
  month++;

}


 // var mongoUtil = require('../bin/mongoUtil');
                mongoUtil.connectToServer(function (err) {

                    var db = mongoUtil.getDb();
                 db.collection('booking').find(	{"chkin":{$gte:start,$lte:end}},{"chkin":1,"rooms":1,"nights":1}).toArray(function(err,docs){

                 	for(i=0;i<docs.length;i++){

                    m=new Date(docs[i].chkin).getMonth()+1
                    y=new Date(docs[i].chkin).getFullYear()
                    //month and year of perticular document
                    my=m+"-"+y
                    for(j=0;j<jsa.length;j++){
                      if(jsa[j].month.localeCompare(my)==0){
                        jsa[j].rooms=parseInt(jsa[j].rooms)+((parseInt(docs[i].rooms))*(parseInt(docs[i].nights)))
                      }
                    }

                 		// if(flg==(y=new Date(docs[i].chkin).getMonth()+1) || i==0){
                 		// 	rom+=docs[i].rooms;
                    //
                    //
                 		// }
                 		// else{
                 		// 	x=new Date(docs[i].chkin).getMonth()+1;
                 		// 	for(j=0;j<months;j++){
                 		// 		if(jsa[j].month==y){
                 		// 			jsa[j].rooms=rom;
                 		// 			rom=0;
                 		// 			y=x;
                    //
                 		// 			break;
                 		// 		}
                 		// 	}
                    //
                 		// 		rom+=docs[i].rooms;
                 		// }
                 	}
                    
                  res.send(jsa)
                 })


});
});



module.exports = router;