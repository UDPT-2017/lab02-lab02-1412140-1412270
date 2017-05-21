var pg = require('pg');

var config = {
	user: 'postgres',
	database: 'lab2',
	password: '1806Pokemon',
	host: 'localhost',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
}
var pool = new pg.Pool(config);

function getData(user, callback) {
	var data = [];
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}

		client.query("select * from friend where useremail = '" + user + "'", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
			data = result;
			
			return callback(data);
		});
	});	
};

function getData2(user, callback) {
	var data = [];
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		client.query("select * from message where touser = '" + user + "'", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
			data = result;
			console.log(result.rows[0].fromuser);
			return callback(data);
		});
	});	
};

var messageController = {
	index: function(req, res) {
		var friend = getData(req.cookies.name, function(e) {
			var mail = getData2(req.cookies.name, function(f) {
				pool.connect(function(err, client, done) {
					if(err) { 
						return console.error('error fetching client from pool', err);
					}
					client.query("SELECT * FROM message where fromuser = '" + req.cookies.name + "'", function(err, result) {
						done();
						if(err) {
							res.end();
							return console.error('error running query', err);
						}
					//	console.log(f.rows[0].friendemail);
						res.render("message", {nick: req.cookies.name, data: result, data2: e, data3: f});
					});
				});	
				return f;
			});
			return e;
		});
	}
}

module.exports = messageController;