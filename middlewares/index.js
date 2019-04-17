const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) return res.status(401).json({
		auth: false,
		errors: 'No token provided.',
	});
	// TODO: Research on whether Authorization: Bearer {token} is better than above 👆
	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) return res.status(500).json({
			auth: false,
			errors: 'Failed to authenticate token.'
		});
		req.userData = decoded;
		next();
	});
}

module.exports = {
    protectedRoute,
}
