'use strict'

const request = require('supertest')
const sinon = require('sinon')
const chai = require('chai')
const should = chai.should()
const mongoose = require('mongoose')
require('sinon-mongoose')

const Game = require('./../server/schemas.js').Game

let server = require('../index')

describe('testing routes', function(){

  it('responds to /', function(done){
    request(server)
      .get('/')
      .expect(200, done)
  })

  it('responds to /input', function(done){
    request(server)
      .get('/input')
      .expect(200, done)
  })

  it('responds to visualize', function(done){
    request(server)
      .get('/visualize')
      .expect(200, done)
  })

  it('responds to analytics', function(done){
    request(server)
      .get('/analytics')
      .expect(200, done)
  })
})

describe('helper routes', function(){

  it('/check', function(done){
    request(server)
      .get('/check?fbid=1')
      .expect(200, done)
  })
  
})

describe('testing games for input', function(){
  it('today', function(done){
    request(server)
      .get('/today')
      .expect(200, done)
  })

  it('tomorrow', function(done){
    request(server)
      .get('/tomorrow')
      .expect(200, done)
  })

  it('soon', function(done){
    request(server)
      .get('/soon')
      .expect(200, done)
  })
})

describe('creating a mew game', function(){
  it("should create new game", function(done){
      var GameMock = sinon.mock(new Game({
        name: "Test Game",
        address: "Some address",
        image_name: "Image name",
        image_url: "https://www.google.com",
        latlong: "51, 0.3",
        when: new Date(),
        desc: "Description field",
        joined: [],
        capacity: 5
      }));
      var game = GameMock.object;
      var expectedResult = { status: true };
      GameMock.expects('save').yields(null, expectedResult);
      game.save(function (err, result) {
          GameMock.verify();
          GameMock.restore();
          (result.status).should.be.true;
          done();
      });
  });
})
