var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('dashboard/index', { title: 'Express' });
});

router.post('/', function (req, res) {
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

router.post('/getdate', function (req, res) {
	res.send(new Date());
});


module.exports = router;
