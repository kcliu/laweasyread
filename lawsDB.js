var mongo = require('mongodb');
var Server = mongo.Server,
	Db = mongo.Db,
	mongoUri = process.env.MONGOLAB_URI || 
               'mongodb://localhost/laweasyread';  

var server = new Server('localhost', 27017);
var db = new Db('laweasyread', server);

var onErr = function(err, callback) {
	db.close();
	callback(err);
};

exports.find_in_laws = function(req, res) {
	var law = req.params.query;
	db.open(function(err, db) {
		if(!err) {
			db.collection('laweasyread_fake', function(err, collection) {
				if(!err) {
					collection.find({"law":law}).toArray(function(err, data) {
						var strJson ="";
						if(!err) {
							res.contentType('application/json');
							strJson += '{"law":"'+law+'","content":"'+data[0].content+'","link":"'+data[0].link+'"}';
							console.log(strJson);
							res.json(JSON.parse(strJson));
							db.close();
						}
						else {onErr(err,callback);}
					});//end of collection.find
				}
				else {onErr(err,callback);}
			});//end of db.collection
		}
		else {onErr(err,callback);}
	});// end of db.open
}

