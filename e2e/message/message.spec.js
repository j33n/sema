const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

const Users = require('../../models/users');
const Message = require('../../models/message');

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

	describe('Read message', () => {
		let messageId;
		beforeEach((done) => {
			chai.request(app)
				.post('/message')
				.set('x-access-token', token)
				.send({
					to: 'john.doe@test.com',
					message: 'Hello!',
				})
				.end((err, res) => {
					if (err) throw err;
					messageId = res.body.user._id
					done();
				});
		});

		it('should be able to read a specific message', (done) => {
			chai.request(app)
				.get(`/message/read/${messageId}`)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body).to.deep.include({
						message: 'Hello!'
					});
					done();
				});
		});

		it('should spot invalid message id request', (done) => {
			chai.request(app)
				.get('/message/read/1')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors').to.deep.include({
						plain: 'Invalid request'
					});
					done();
				});
		});

		it('should spot valid mongoid but invalid message id', (done) => {
			chai.request(app)
				.get('/message/read/5cac4a535bf20bac85659506')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('errors').to.deep.include({
						plain: 'Message not found'
					});
					done();
				});
		});

		it('should mark the message as read after fetching it', (done) => {
			Message.findById(messageId, (err, message) => {
				if (err) throw err;
				expect(message).to.deep.include({
					message: 'Hello!',
					read: false,
				})
			});

			chai.request(app)
				.get(`/message/read/${messageId}`)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body).to.deep.include({
						message: 'Hello!',
						read: true,
					});
					done();
				});
		});

		it('should be able to fetch received messages', (done) => {
			chai.request(app)
				.get('/message/received')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body).to.deep.include({
						message: 'Messages fetched successfuly',
					});
					expect(res.body).to.have.property('messages').to.have.length(1);
					done();
				});
		});

		it('should be able to alert empty inbox', (done) => {
			Message.deleteOne({
				_id: messageId
			}, (err, message) => {
				if (err) throw err;
				expect(message).to.deep.include({
					n: 1,
					ok: 1,
					deletedCount: 1
				})
			});

			chai.request(app)
				.get('/message/received')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('messages').to.have.length(0);
					expect(res.body).to.have.property('errors').to.deep.include({
						plain: 'No message found',
					});
					done();
				});
		});

		it('should be able to fetch sent messages', (done) => {
			chai.request(app)
				.get('/message/sent')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					expect(res.body).to.deep.include({
						message: 'Messages fetched successfuly',
					});
					expect(res.body).to.have.property('messages').to.have.length(1);
					done();
				});
		});

		it('should be able to alert empty outbox', (done) => {
			Message.deleteOne({
				_id: messageId
			}, (err, message) => {
				if (err) throw err;
				expect(message).to.deep.include({
					n: 1,
					ok: 1,
					deletedCount: 1
				})
			});

			chai.request(app)
				.get('/message/sent')
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(422);
					res.body.should.be.a('object');
					expect(res.body).to.have.property('messages').to.have.length(0);
					expect(res.body).to.have.property('errors').to.deep.include({
						plain: 'No message found',
					});
					done();
				});
		});
	});

	afterEach(() => {
		// Time to destroy our lovely messages 😢
		Message.deleteMany().exec();
	});
});