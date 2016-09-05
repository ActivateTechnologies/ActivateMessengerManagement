'use strict'

const request = require('supertest')
const sinon = require('sinon')
const chai = require('chai');
const expect = chai.expect;
const server = require('./../app/index')
const Event = require('./../app/schemas.js').Event
require('sinon-mongoose')

describe('testing dashboard routes', function(){

  it('should return button hits', function(done){
    request(server)
      .get('/dashboardData?requiredData=getButtonHitsOverTime')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('should return tickets sold', function(done){
    request(server)
      .get('/dashboardData?requiredData=getTicketsSoldOverTime')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('should return new members', function(done){
    request(server)
      .get('/dashboardData?requiredData=getNewMembersOverTime')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

})
