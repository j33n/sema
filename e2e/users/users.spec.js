const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../../app');

const Users = require('../../models/users');

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
				res.should.have.status(201);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					username: 'johndoe@test.com',
				});
				done();
			});
	});

	it('should not allow user account duplicates', (done) => {
		const newUser = {
			username: 'johndoe@test.com',
			password: 'secret',
			phone: '123456',
		};
		Users.create(newUser);
		chai.request(app)
			.post('/user/sign-up')
			.send(newUser)
			.end((err, res) => {
				res.should.have.status(400);
				expect(res.body).to.deep.include({
					errors: 'User account already exists',
				});
				done();
			});
	});
});