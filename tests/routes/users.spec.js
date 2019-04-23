const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Users", () => {
	// Test to get all students record
	it("should detect invalid data in sign up", (done) => {
		chai.request(app)
			.post('/user/sign-up')
			.send({
				password: 'test',
				username: 'l'
			})
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('object');
				expect(res.body).to.haveOwnProperty('errors').to.be.an('array').to.deep.include({
					location: 'body',
					param: 'username',
					value: 'l',
					msg: 'Invalid value'
				});
				expect(res.body).to.haveOwnProperty('errors').to.be.an('array').to.deep.include({
					location: 'body',
					param: 'password',
					value: 'test',
					msg: 'Invalid value'
				});
				expect(res.body).to.haveOwnProperty('errors').to.be.an('array').to.deep.include({
					location: 'body',
					param: 'phone',
					msg: 'Invalid value'
				});
				done();
			});
	});
});