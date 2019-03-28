const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("GET /", () => {
	// Test to get all students record
	it("should get the homepage", (done) => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				expect(res.body).to.haveOwnProperty('body').to.equal('Welcome home')
				done();
			});
	});
});