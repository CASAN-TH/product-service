'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Product = mongoose.model('Product');

var credentials,
    token,
    mockup;

describe('Product CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            name: 'ลิปติก',
            image: 'image.png',
            price: 120,
            option: [
                {
                    name: 'สี',
                    value: [
                        {
                            name: "#01"
                        },
                        {
                            name: "#02"
                        }

                    ]
                }
            ]

        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    const filePath = 'images/test.jpg'

    it('should be Product get use token', (done) => {
        request(app)
            .get('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Product get by id', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        setTimeout(() => {
                            assert.equal(resp.status, 200);
                            assert.equal(resp.data.name, mockup.name);
                            assert.equal(resp.data.image, mockup.image);
                            assert.equal(resp.data.price, mockup.price);
                            assert.equal(resp.data.option[0].name, mockup.option[0].name);
                            assert.equal(resp.data.option[0].value.name, mockup.option[0].value.name);
                            assert.equal(resp.data.option[1].value.name, mockup.option[1].value.name);
                        }, 1000);
                        done();
                    });
            });

    });

    it('should be Product post use token', (done) => {
        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                setTimeout(() => {
                    assert.equal(resp.status, 200);
                    assert.equal(resp.data.name, mockup.name);
                    assert.equal(resp.data.image, mockup.image);
                    assert.equal(resp.data.price, mockup.price);
                    assert.equal(resp.data.option[0].name, mockup.option[0].name);
                    assert.equal(resp.data.option[0].value.name, mockup.option[0].value.name);
                    assert.equal(resp.data.option[1].value.name, mockup.option[1].value.name);
                }, 1000);
                done();
            });
    });

    it('should be product put use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be product delete use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/products/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('Should Be get Data URL', function (done) {
        request(app)
            .post('/api/productsimage')
            .set('Authorization', 'Bearer ' + token)
            .attach('filename', filePath)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                // console.log(resp)
                assert.equal(resp.data.original_filename, 'test')
                assert.equal(resp.data.resource_type, 'image')
                assert.equal(resp.data.format, 'jpg')
                assert.notEqual(resp.data.url, '')
                assert.notEqual(resp.data.secure_url, '')
                done();
            });
    });

    it('should be product get not use token', (done) => {
        request(app)
            .get('/api/products')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be product post not use token', function (done) {

        request(app)
            .post('/api/products')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be product put not use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/products/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be product delete not use token', function (done) {

        request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/products/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Product.remove().exec(done);
    });

});