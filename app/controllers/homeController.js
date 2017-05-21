var homeController = {
	index: function(req, res) {
		res.render('home', {
		nick: req.cookies.name
		});
	}
}

module.exports = homeController;
