exports.homepage = function(req, res) {
	res.render('user', {
		title: 'Home of heroes'
	});
}
