'use strict'

const request = require('supertest')
const sinon = require('sinon')

const Game = require('./../server/schemas.js').Game

let server = require('../index')

describe('testing routes', function(){

  it('responds to /', function(done){
    request(server)
      .get('/')
      .expect(200, done)
  })

  it('responds to /dashboard', function(done){
    request(server)
      .get('/dashboard')
      .expect(200, done)
  })

  it('responds to /message', function(done){
    request(server)
      .get('/message')
      .expect(200, done)
  })

  it('responds to /users', function(done){
    request(server)
      .get('/users')
      .expect(200, done)
  })

})
