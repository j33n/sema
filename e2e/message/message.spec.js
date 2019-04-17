const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

const Users = require('../../models/users');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Message", () => {
	// Test to get all students record

	let token;

	beforeEach((done) => {
		// Create our Adam user 😆
		chai.request(app)
			.post('/user/sign-up')
			.send({
				username: 'john.doe@test.com',
				password: 'secret',
				phone: '12345'
			})
			.end((err, res) => {
				if (err) throw err;
				done();
			});
	});

	beforeEach((done) => {
		// Log in Adam 👨
		chai.request(app)
			.post('/user/log-in')
			.send({
				username: 'john.doe@test.com',
				password: 'secret',
			})
			.end((err, res) => {
				if (err) throw err;
				token = res.body.token;
				return done(null, res)
			});
	});

	it('should be able to login', (done) => {
		chai.request(app)
			.post('/user/log-in')
			.send({
				username: 'john.doe@test.com',
				password: 'secret',
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'User authenticated successfully'
				});
				done();
			});
	});

	it('should be able to spot invalid login details', (done) => {
		chai.request(app)
			.post('/user/log-in')
			.send({
				username: 'john.doe@test.com',
				password: 'invalid-password',
			})
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					errors: 'Invalid user credentials',
				});
				done();
			});
	});

	it("should be able to send a message", (done) => {
		chai.request(app)
			.post('/message')
			.set('x-access-token', token)
			.send({
				from: 'john.doe@test.com',
				to: 'john.doe@test.com',
				message: 'Hello!',
			})
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'Message sent!'
				});
				done();
			});
	});

	it('should be able to spot if the message recipient is empty', (done) => {
		chai.request(app)
			.post('/message')
			.set('x-access-token', token)
			.send({
				to: '',
				message: 'Hello!',
			})
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					errors: [{
						msg: 'Invalid value(s)',
						nestedErrors: [{
							location: "body",
							msg: "Please provide a valid email or phone number",
							param: "to",
							value: "",
						}, {
							location: "body",
							msg: "Please provide a valid email or phone number",
							param: "to",
							value: "",
						}],
						param: "_error",
					}]
				});
				done();
			});
	});
});