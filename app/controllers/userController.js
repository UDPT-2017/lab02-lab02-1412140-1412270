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

var userContronller = {
	index: function(req, res) {
		var friend = getData(req.cookies.name, function(f) {
			pool.connect(function(err, client, done) {
				if(err) { 
					return console.error('error fetching client from pool', err);
				}
				client.query("SELECT email from userinfo where email not in (select friendemail from friend where useremail = '" + req.cookies.name + "')", function(err, result) {
					done();
					if(err) {
						res.end();
						return console.error('error running query', err);
					}
				//	console.log(f.rows[0].friendemail);
					res.render("user", {nick: req.cookies.name, data: result, data2: f});
				});
			});
			return f;
		});	
	}
}

module.exports = userContronller;