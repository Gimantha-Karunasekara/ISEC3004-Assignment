const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../');
const baseUrl = 'http://localhost:5000';
let user;

chai.use(chaiHttp);

describe('App', function () {
  it('should backend and database servers live', function (done) {
    chai
      .request(baseUrl)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).contain({ backend: true });
        done();
      });
  });

  it('sign up', function (done) {

    const data = { name: 'testName', email: 'testEmail', password: 'pass' }

    chai
      .request(baseUrl)
      .post('/signup')
      .send(data)
      .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        done();
      });
  });

  it('log in', function (done) {

    const data = { email: 'testEmail', password: 'pass' }

    chai
      .request(baseUrl)
      .post('/login')
      .send(data)
      .end(function (err, res) {
        user = res.body;
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('get users', function (done) {

    chai
      .request(baseUrl)
      .get('/users')
      .set('auth-token', user.token.split(' ')[1])
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('get user', function (done) {

    chai
      .request(baseUrl)
      .get('/user')
      .set('auth-token', user.token.split(' ')[1])
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('post image', function (done) {

    const data = {img: 'https://images.unsplash.com/photo-1520453803296-c39eabe2dab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVsbG98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' , user: user._id}
    
    chai
      .request(baseUrl)
      .post('/create')
      .send(data)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('get images', function (done) {

    chai
      .request(baseUrl)
      .post('/images')
      .send({_id: user._id})
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('delete user', function (done) {

    chai
      .request(baseUrl)
      .delete('/deleteUser')
      .set('auth-token', user.token.split(' ')[1])
      .send({id: user._id})
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

});

describe('NoSQL Injection Test', function () {

  it('should prevent NoSQL injection', async function () {

    const maliciousInput = { email: {"$ne": null}, password: {"$ne": null} }

    const res = await chai
      .request(baseUrl)
      .post('/login')
      .send(maliciousInput);
    expect(res).to.have.status(400);
  });

});

describe('XSS Attack Test', function () {

  it('should prevent XSS attacks', async function () {

    const maliciousInput = { name: '<script>alert("This is an XSS attack")</script>', email: 'testEmail', password: 123 }

    const res = await chai
      .request(baseUrl)
      .post('/signup')
      .send(maliciousInput);

    expect(res).to.have.status(400);
  });

});