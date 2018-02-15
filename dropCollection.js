var MongoClient = require('mongodb');
var url = "mongodb://admin:admin@ds227858.mlab.com:27858/cms";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("avail").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
  db.collection("booking").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
  db.collection("common").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
  db.collection("contents").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
  db.collection("users").drop(function(err, delOK) {
    if (err) throw err;
    if (delOK) console.log("Collection deleted");
  });
});
