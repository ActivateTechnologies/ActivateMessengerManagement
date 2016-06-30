'use strict'

const request = require('supertest')
const chai = require('chai')
const should = chai.should()

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
