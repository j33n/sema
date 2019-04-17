const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Should check authentication", () => {
	// Test to get all students record
	it("requires auth to send message", (done) => {
		chai.request(app)
			.post('/message')
			.send({
				to: '',
				message: '',
			})
			.end((err, res) => {
				res.should.have.status(401);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					auth: false,
					errors: 'No token provided.'
				});
				done();
			});
	});

	it('should deny invalid tokens ⛔️', (done) => {
		chai.request(app)
			.post('/message')
			.set('x-access-token', 'fake-token')
			.send({
				to: '123',
				message: '1234',
			})
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					auth: false,
					errors: 'Failed to authenticate token.'
				});
				done();
			});
	});
});