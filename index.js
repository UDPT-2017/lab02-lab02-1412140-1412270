var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var path = require('path');
var cookie = require('cookie');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.static('public'));

app.engine('hbs', exphbs({
	extname: '.hbs',
	defaultLayout: 'application',
	layoutsDir: path.resolve('app/views/layouts')
}));

app.set('view engine', 'hbs');
app.set('views', path.resolve('./app/views'));

app.listen(process.env.PORT || 3000);

var bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({ extended: false});
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
var connectionString = 'postgres://postgres:1806Pokemon@localhost:5432/lab2';

var controllers = require('./app/controllers');

app.get('/', controllers.home.index);

app.get('/signup', function(req, res) {
	res.render('signup');
});

app.get('/logout', function(req, res) {
	res.cookie('name', '');
	res.redirect('/');
});

app.get('/messages',urlencodedParser, controllers.message.index);

app.post('/addFriend/:id', function(req, res) {
	var id = req.params.id;
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		client.query("INSERT INTO friend(useremail, friendemail) VALUES('" + req.cookies.name + "', '" + id + "')", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
		//	console.log(f.rows[0].friendemail);
			
		});
	});
	res.redirect(req.get('referer'));
	console.log(id);
});

app.post('/remoteFriend/:id', function(req, res) {
	var id = req.params.id;
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		client.query("DELETE FROM friend WHERE friendemail = '" + id +"' and useremail = '" + req.cookies.name + "'", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
		//	console.log(f.rows[0].friendemail);
			res.redirect(req.get('referer'));	
		});
	});
});

app.get('/users', controllers.user.index);

app.post("/signup", urlencodedParser, function(req, res) {
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		var email = req.body.txtEmail;
		var pass = req.body.txtPass;
		var name = req.body.txtName;
		var phone = req.body.txtPhone;

		client.query("INSERT INTO UserInfo(email, password, name, phone) VALUES('" + email + "', '" + pass + "', '" + name + "', '" + phone +"')", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
			console.log("Tao tk th/cong");
			res.render("home", {nick: name});
		});
	});
});

app.post("/writeMessage", urlencodedParser, function(req, res) {
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}
		var email = req.body.txtTo;
		var content = req.body.txtContent;

		client.query("INSERT INTO message(fromuser, touser, nd) VALUES('" + req.cookies.name + "', '" + email + "', '" + content + "')", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
		//	console.log("Da gui tin nhan");
			res.redirect('/messages');
		});
	});
});

app.post("/login", urlencodedParser, function(req, res){
	pool.connect(function(err, client, done) {
		if(err) { 
			return console.error('error fetching client from pool', err);
		}

		var email = req.body.txtEmail;
		var pass = req.body.txtPass;
		client.query("select count(*) from userinfo where email = '" + email + "' and password = '" + pass + "'", function(err, result) {
			done();
			if(err) {
				res.end();
				return console.error('error running query', err);
			}
			if(result.rows[0].count == "1"){
				console.log("dang nhap thanh cong " + email);
				res.cookie('name', email);
			}
			if(result.rows[0].count == "0"){
				console.log("dang nhap that bai ");
				console.log(email);
			}
			res.redirect(req.get('referer'));
		});
	});
});