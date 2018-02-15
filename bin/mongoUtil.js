var mongo = require('mongodb');
var path=require('path');
var murl=require('./config').maindetails().dburl;

//var murl='mongodb://admin:admin@ds141796.mlab.com:41796/cms';
var _db;

module.exports = {

  connectToServer: function( callback ) {
    mongo.connect( murl, function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};