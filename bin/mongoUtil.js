// var mongo = require('mongodb');
// var path=require('path');

// try {
//   var  murl=require('./config').maindetails().dburl;
//  // a path we KNOW is totally bogus and not a module
 
// var _db;

// module.exports = {

//   connectToServer: function( callback ) {

//     console.log(typeof murl+ "url lijnk:"+ murl);
   
//     mongo.connect( murl, function( err, db ) {
//       _db = db;
//       return callback(err, db);
//     } );
//   },

//   getDb: function() {
//     return _db;
//   }
// };
// }
// catch (e) {
//   console.log("not fount murl")
 
 
// }

var mongo = require('mongodb');
var path=require('path');

try {
 // a path we KNOW is totally bogus and not a module
murl=require('./config').maindetails().dburl; 
var _db;

module.exports = {

  connectToServer: function( callback ) {

    // console.log(typeof murl+ "url lijnk:"+ murl);
    
    mongo.connect( murl, function( err, db ) {
      _db = db;
      return callback(err, db);
    } );
  },

  getDb: function() {
    return _db;
  }
};
}
catch (e) {
  console.log("not fount murl")
 
 
}


//var murl='mongodb://admin:admin@ds141796.mlab.com:41796/cms';
