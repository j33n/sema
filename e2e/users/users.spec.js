const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
	it('should save data to the database', (done) => {
		chai.request(app)
			.post('/user/sign-up')
			.send({
				username: 'johndoe@test.com',
				password: 'secret',
				phone: '123456',
			})
			.end((err, res) => {
				console.log('----------', res.body)
				res.should.have.status(422);
				res.body.should.be.a('object');
				// expect(res.body).to.haveOwnProperty('errors').to.be.an('array').to.deep.include({
				// 	location: 'body',
				// 	param: 'username',
				// 	value: 'lorem',
				// 	msg: 'Invalid value'
				// });
				done();
			});
	});
});