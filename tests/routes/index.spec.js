const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Index page", () => {
	// Test to get all students record
	it("should get the homepage or /", (done) => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				expect(res.body).to.haveOwnProperty('body').to.equal('Welcome home')
				done();
			});
	});

	it("should respond with `Not Found` when endpoint is missing", (done) => {
		chai.request(app)
			.get('/invalid-endpoint')
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('object');
				expect(res.body).to.haveOwnProperty('error').to.haveOwnProperty('message').to.equal('Not Found')
				done();
			});
	});
});