'use strict'

const request = require('supertest')
const sinon = require('sinon')
const chai = require('chai');
const expect = chai.expect;
const server = require('../index')
const Event = require('./../server/schemas.js').Event
require('sinon-mongoose')

describe('testing event routes', function(){

  it('should return all current events', function(done){
    request(server)
      .get('/currentEvents')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

  it('should return all past events', function(done){
    request(server)
      .get('/pastEvents')
      .expect('Content-Type', /json/)
      .expect(200, done)
  })

})

describe("editing events", function(){

    it("should create new event", function(done){
      var EventMock = sinon.mock(Event({
        "name": "Test Event",
        "strapline": "The Hub, Regents Park, London NW1 4NU",
        "image_url": "https://kickabout-messenger.s3-eu-west-1.amazonaws.com/7f7de8c70ac0fd3c729c9faa72ea576a?AWSAccessKeyId=AKIAIAQYS6UTUGDGOUPA&Expires=1497886983&Signature=rOJp9ABIuOesrtsrkQj7kInCV%2BM%3D",
        "image_name": "7f7de8c70ac0fd3c729c9faa72ea576a",
        "latlong": "51.5312705,-0.1591581",
        "desc": "Come join us for a kickabout at Regents Park on Sunday. It's a really casual game so all are welcome. We'll meet at The Hub but look for us nearby once we've set up the pitch. Any issues call Alex on: 07825 542533",
        "when": {
            "$date": "2016-07-10T00:00:00.000Z"
        },
        "capacity": 22,
        "joined": []
      }));
      var event = EventMock.object;
      var expectedResult = { status: true };
      EventMock.expects('save').yields(null, expectedResult);
      event.save(function (err, result) {
          EventMock.verify();
          EventMock.restore();
          expect(result.status).to.be.true;
          done();
      });
    });

    it("should return error, if event not saved", function(done){
        var EventMock = sinon.mock(Event({
          "name": "Test Event",
          "strapline": "The Hub, Regents Park, London NW1 4NU",
          "image_url": "https://kickabout-messenger.s3-eu-west-1.amazonaws.com/7f7de8c70ac0fd3c729c9faa72ea576a?AWSAccessKeyId=AKIAIAQYS6UTUGDGOUPA&Expires=1497886983&Signature=rOJp9ABIuOesrtsrkQj7kInCV%2BM%3D",
          "image_name": "7f7de8c70ac0fd3c729c9faa72ea576a",
          "latlong": "51.5312705,-0.1591581",
          "desc": "Come join us for a kickabout at Regents Park on Sunday. It's a really casual game so all are welcome. We'll meet at The Hub but look for us nearby once we've set up the pitch. Any issues call Alex on: 07825 542533",
          "when": {
              "$date": "2016-07-10T00:00:00.000Z"
          },
          "capacity": 22,
          "joined": []
        }));
        var event = EventMock.object;
        var expectedResult = { status: false };
        EventMock.expects('save').yields(expectedResult, null);
        event.save(function (err, result) {
            EventMock.verify();
            EventMock.restore();
            expect(err.status).to.not.be.true;
            done();
        });
    });
});
