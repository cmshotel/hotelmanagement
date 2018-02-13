var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var form = require('./bin/configform');
var index = require('./routes/');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res, next) {
    path = './bin'
    flg = 0;
    fs.readdir(path, function(err, items) {

        for (var i = 0; i < items.length; i++) {

            if (items[i].toString().localeCompare('config.js') == 0) {
                flg = 1
                var mongoUtil = require('./bin/mongoUtil');
                mongoUtil.connectToServer(function(err) {

                    var db = mongoUtil.getDb();
                    db.listCollections().toArray(function(err, collInfos) {
                        // collInfos is an array of collection info objects that look like:
                        // { name: 'test', options: {} }
                        collaction_count = 0
                        for (i = 0; i < collInfos.length; i++) {
                            if (collInfos[i].name.localeCompare('users') == 0 || collInfos[i].name.localeCompare('avail') == 0 || collInfos[i].name.localeCompare('common') == 0 || collInfos[i].name.localeCompare('booking') == 0 || collInfos[i].name.localeCompare('contents') == 0) {
                                collaction_count++;
                            }
                        }
                        if (collaction_count == 5) {
                            console.log('OK');
                            res.render('dashboard/index');


                        } else {
                            //if database not matches


                            res.send(form.mainform());


                        }

                    });
                });


            } else {
                //if config.js not found at last index
                if (i == (items.length - 1) && flg == 0) {

                    res.send(form.mainform());

                }

            }

        }

    });


})
app.post('/Createadmin', function(req, res, next) {
    hname = req.body.hotelname;
    dburl = req.body.dburl;
    fs = require('fs');
    st = "jso={dburl: '" + dburl + "', hotel_name: '" + hname + "'};" +
        "module.exports = {" +
        " maindetails: function() {" +
        "return  jso;" +
        "}  " +
        "};"
    //write file config.js first

    fs.writeFile('./bin/config.js', st, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        //console.log('Config File Created!');
        //connect by mongoUtil
        var mongoUtil = require('./bin/mongoUtil');
        mongoUtil.connectToServer(function(err) {
            if (err) {

                //res.send('Database not Connected');
                fs.unlink('./bin/config.js', function(err) {
                    if (err) return console.log(err);
                    //console.log('file deleted successfully');
                });
                //req.flash('failure','please insert correct link')
                res.send('<h3><font color="red">*Please Insert Correct Database Link</font></h3>' + form.mainform());
            } else {

                var db = mongoUtil.getDb();

                db.listCollections().toArray(function(err, collInfos) {
                    if (collInfos.length == 0 || collInfos.length == 1) {
                        cols = ["users", "common", "booking", "avail", "contents"];
                        for (i = 0; i < 5; i++) {
                            db.createCollection(cols[i], function(err, res) {
                                if (err) throw err;


                            });
                        }
                        console.log('Collections created');
                        res.render('initial-setup/common');

                    } else {

                        fs.unlink('./bin/config.js', function(err) {
                            if (err) return console.log(err);
                            console.log('file deleted successfully');
                        });

                        res.send('<h3><font color="red">*please change the databse link or truncate database</font></h3>' + form.mainform());
                        //console.log('Please choose another link or empty database'); 
                    }

                });
                /* */

            }
        });
    });


});

app.post('/initializedb', function(req, res, next) {
    noofcat = req.body.noofcat;
    noofplans = req.body.noofplans;
    stayslabs = req.body.stayslabs;
    foodslabs = req.body.foodslabs;
    aname = req.body.aname;
    email = req.body.email;

    categ = []
    plan = []
    stayslabarr = []
    foodslabarr = []

    for (i = 0; i < noofcat; i++) {
        cn = "catname" + i;

        categ.push(req.body[cn])

    }
    for (i = 0; i < noofplans; i++) {
        cn = "planname" + i;

        plan.push(req.body[cn])
    }


    for (i = 0; i < stayslabs; i++) {
        a = 'stayslabfrom' + i;
        b = 'stayslabto' + i;
        c = 'stayslabper' + i;

        if (req.body[b].toString().localeCompare("") == 0 || req.body[b] == null) {
            temp = {
                "range": req.body[a],
                "rate": req.body[c]
            };
        } else {
            temp = {
                "range": req.body[a] + "-" + req.body[b],
                "rate": req.body[c]
            };
        }
        stayslabarr.push(temp);
    }
    for (i = 0; i < foodslabs; i++) {
        a = 'foodslabfrom' + i;
        b = 'foodslabto' + i;
        c = 'foodslabper' + i;
        if (req.body[b].toString().localeCompare("") == 0 || req.body[b] == null) {
            temp = {
                "range": req.body[a],
                "rate": req.body[c]
            };
        } else {
            temp = {
                "range": req.body[a] + "-" + req.body[b],
                "rate": req.body[c]
            };
        }
        foodslabarr.push(temp);
    }

    docs = [{
        "catagories": categ,
        "plans": plan
    }, {
        "gst": [{
            "stayslabs": stayslabarr
        }, {
            "foodslabs": foodslabarr
        }]
    }];

    var mongoUtil = require('./bin/mongoUtil');
    mongoUtil.connectToServer(function(err) {
        if (err) {} else {
            var db = mongoUtil.getDb();
            db.collection('common').insertMany(docs, function(error, inserted) {
                if (error) {
                    console.error(error);
                } else {

                    //insert email to users database
                    db.collection("users").insertOne({
                        "name": aname,
                        "role": "admin",
                        "email": email,
                        "passwd": ""
                    }, function(err, res) {
                        if (err) throw err;
                        else {
                            res.render('dashboard/index');
                            db.close();
                        }

                    });




                }

            });


        }

    });



});

//
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;