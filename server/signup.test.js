const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assuming your Express app is exported as 'app'

chai.use(chaiHttp);
const expect = chai.expect;

describe('Signup API Endpoint', () => {
  it('should create a new user with valid data', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'test123',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message').to.equal('User created successfully');
        expect(res.body).to.have.property('userId').to.be.a('string');
        done();
      });
  });

  it('should return an error when required fields are missing', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        email: '', // Missing email
        password: 'test123',
        confirmPassword: 'test123',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.equal('All fields are required');
        done();
      });
  });

  it('should return an error when passwords do not match', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'mismatched', // Passwords do not match
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').to.equal('Passwords do not match');
        done();
      });
  });

  it('should return an error if the user already exists', (done) => {
    chai
      .request(app)
      .post('/signup')
      .send({
        username: 'testuser', // Username already exists
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'test123',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.have.property('error').to.equal('User already exists');
        done();
      });
  });
});
