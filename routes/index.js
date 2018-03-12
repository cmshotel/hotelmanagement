var mongo = require("mongodb");
var fs = require("fs");
var assert = require("assert");
var form = require("../bin/configform");
var express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  path = "./bin";
  flg = 0;
  fs.readdir(path, function(err, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].toString().localeCompare("config.js") == 0) {
        flg = 1;
        var mongoUtil = require("../bin/mongoUtil");
        mongoUtil.connectToServer(function(err, db) {
          // var db = mongoUtil.getDb();
          db.listCollections().toArray(function(err, collInfos) {
            // collInfos is an array of collection info objects that look like:
            // { name: 'test', options: {} }
            collaction_count = 0;
            for (i = 0; i < collInfos.length; i++) {
              if (
                collInfos[i].name.localeCompare("users") == 0 ||
                collInfos[i].name.localeCompare("avail") == 0 ||
                collInfos[i].name.localeCompare("common") == 0 ||
                collInfos[i].name.localeCompare("booking") == 0 ||
                collInfos[i].name.localeCompare("contents") == 0
              ) {
                collaction_count++;
              }
            }
            if (collaction_count == 5) {
              console.log(req.session.uid);
              /**
               * Check session is set?
               * if set then goto dashboard otherwise goto login
               */
              if (req.session.uid) 
                res.redirect("dashboard");
              else 
              res.redirect("login");
            } else {
              /**
               * if database not matches
               */
              res.send(form.mainform());
            }
          });
        });
      } else {
        /**
         * if config.js not found at last index
         */
        if (i == items.length - 1 && flg == 0) {
          res.send(form.mainform());
        }
      }
    }
  });
});

router.post("/Createadmin", function(req, res, next) {
  hname = req.body.hotelname;
  dburl = req.body.dburl;
  fs = require("fs");
  st =
    "jso={dburl: '" +
    dburl +
    "', hotel_name: '" +
    hname +
    "'};" +
    "module.exports = {" +
    " maindetails: function() {" +
    "return  jso;" +
    "}  " +
    "};";
  //write file config.js first

  fs.writeFile("./bin/config.js", st, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    //console.log('Config File Created!');
    //connect by mongoUtil
    var mongoUtil = require("../bin/mongoUtil");
    mongoUtil.connectToServer(function(err, db) {
      if (err) {
        //res.send('Database not Connected');
        fs.unlink("../bin/config.js", function(err) {
          if (err) return console.log(err);
          //console.log('file deleted successfully');
        });
        //req.flash('failure','please insert correct link')
        res.send(
          '<h3><font color="red">*Please Insert Correct Database Link</font></h3>' +
            form.mainform()
        );
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
            console.log("Collections created");
            res.render("initial-setup/common");
          } else {
            fs.unlink("./bin/config.js", function(err) {
              if (err) return console.log(err);
              console.log("file deleted successfully");
            });

            res.send(
              '<h3><font color="red">*please change the databse link or truncate database</font></h3>' +
                form.mainform()
            );
            //console.log('Please choose another link or empty database');
          }
        });
        /* */
      }
    });
  });
});

router.post("/initializedb", function(req, res, next) {
  noofcat = req.body.noofcat;
  noofplans = req.body.noofplans;
  stayslabs = req.body.stayslabs;
  foodslabs = req.body.foodslabs;
  aname = req.body.aname;
  email = req.body.email;

  categ = [];
  plan = [];
  stayslabarr = [];
  foodslabarr = [];

  for (i = 0; i < noofcat; i++) {
    cn = "catname" + i;

    categ.push(req.body[cn]);
  }
  for (i = 0; i < noofplans; i++) {
    cn = "planname" + i;

    plan.push(req.body[cn]);
  }

  for (i = 0; i < stayslabs; i++) {
    a = "stayslabfrom" + i;
    b = "stayslabto" + i;
    c = "stayslabper" + i;

    if (req.body[b].toString().localeCompare("") == 0 || req.body[b] == null) {
      temp = {
        range: req.body[a],
        rate: req.body[c]
      };
    } else {
      temp = {
        range: req.body[a] + "-" + req.body[b],
        rate: req.body[c]
      };
    }
    stayslabarr.push(temp);
  }
  for (i = 0; i < foodslabs; i++) {
    a = "foodslabfrom" + i;
    b = "foodslabto" + i;
    c = "foodslabper" + i;
    if (req.body[b].toString().localeCompare("") == 0 || req.body[b] == null) {
      temp = {
        range: req.body[a],
        rate: req.body[c]
      };
    } else {
      temp = {
        range: req.body[a] + "-" + req.body[b],
        rate: req.body[c]
      };
    }
    foodslabarr.push(temp);
  }

  docs = [
    {
      catagories: categ,
      plans: plan
    },
    {
      gst: [
        {
          stayslabs: stayslabarr
        },
        {
          foodslabs: foodslabarr
        }
      ]
    }
  ];
  console.log(docs);
  var mongoUtil = require("../bin/mongoUtil");
  mongoUtil.connectToServer(function(err, db) {
    console.log(new Date() + " Connect to db......");
    if (err) {
    } else {
      // var db = mongoUtil.getDb();
      db.collection("common").insertMany(docs, function(error, inserted) {
        if (error) {
          console.error(error);
        } else {
          //insert email to users database
          db.collection("users").insertOne(
            {
              name: aname,
              role: "admin",
              email: email,
              passwd: ""
            },
            function(err) {
              if (err) throw err;
              db.close();
            }
          );
          //use promise
          //put login page not dashboard
          res.redirect("login");
        }
      });
    }
  });
});

router.post("/getcheckins", function(req, res, next) {
  var mongoUtil = require("../bin/mongoUtil");
  console.log(new Date() + " POST /getcheckins");
  chkind = req.body.chkindate;
  console.log(chkind);
  var data = null;
  mongoUtil.connectToServer(function(err, db) {
    console.log(err);
    assert.equal(null, err);
    db
      .collection("booking")
      .find(
        {
          $or: [
            {
              chkin: chkind
            },
            {
              chkout: chkind
            }
          ]
        },
        {
          _id: 1,
          cname: 1,
          chkin: 1,
          chkout: 1
        }
      )
      .toArray(function(err, docs) {
        assert.equal(null, err);
        db.close();
        for (i = 0; i < docs.length; i++) {
          if (docs[i]["chkin"] === chkind) docs[i]["action"] = "CheckIn";
          if (docs[i]["chkout"] === chkind) docs[i]["action"] = "CheckOut";
        }
        // console.log(docs)
        res.send(docs);
      });
  });
});

router.post("/getdate", function(req, res, next) {
  res.send(new Date());
});

router.post("/logincred", function(req, res, next) {
  var mongoUtil = require("../bin/mongoUtil");
  ux = req.body.ux;
  uy = req.body.uy;
  console.log(ux + " " + uy);
  mongoUtil.connectToServer(function(err, db) {
    if (err) throw err;
    db
      .collection("users")
      .findOne({
        $and: [
          {
            email: ux
          },
          {
            passwd: uy
          }
        ]
      })
      .then(function(udata) {
        if (udata) {
          req.session.uid = udata._id;
          req.session.name = udata.name;
          req.session.email = udata.email;
          req.session.role = udata.role;
          res.redirect("/");
        } else {
          res.redirect("/login");
        }
      });
  });
});

router.get("/login", function(req, res, next) {
  res.render("login");
});

router.get("/dashboard", function(req, res, next) {
  if (req.session.uid && req.session.email)
    res.render("dashboard", {
      session: req.session
    });
  else res.redirect("/login");
});
module.exports = router;
