'use strict'

const request = require('supertest')
const sinon = require('sinon')
const chai = require('chai');
const expect = chai.expect;
const server = require('../index')
const Event = require('./../server/schemas.js').Event
require('sinon-mongoose')

describe('testing dashboard routes', function(){

  it('should return button hits', function(done){
    request(server)
      .get('/dashboardData?requiredData=getButtonHitsOverTime')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  

})
