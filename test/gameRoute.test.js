/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const request = require('request')
const assert = require('assert')
const db = require('../database/config/database')
const Users = require('../database/models/Users')
const Games = require('../database/models/Games')
const Questions = require('../database/models/Questions')
const app = require('../app')

describe('Routes', () => {
  describe('POST/add-game', function () {
    // eslint-disable-next-line no-undef
    beforeEach(async () => {
      await db.sync({
        force: true
      })
      await Users.create({
        name: 'abdallah',
        email: 'abdallah@gmail.com',
        password: 'abdallah'
      })
    })

    it('Adds a game for exisiting user', function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/add-game',
          body: `{
                  "userId": 1,
                  "name": "Name",
                  "type": "True or false",
                  "questions": [
                      {
                          "question": "My name is abdalkl",
                          "answer" : "true"
                      }
                  ]
              }`
        },
        (error, response, body) => {
          if (error) throw error
          assert.strict.equal(JSON.parse(body).statusCode, '1')
          done()
        }
      )
    })

    it("Doesn't Add Game for non-exisiting user", function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/add-game',
          body: `{
                  "userId": 2,
                  "name": "Name",
                  "type": "True or false",
                  "questions": [
                      {
                          "question": "My name is abdalkl",
                          "answer" : "true"
                      }
                  ]
              }`
        },
        (error, response, body) => {
          if (error) throw error
          assert.strict.equal(JSON.parse(body).statusCode, '-1')
          done()
        }
      )
    })

    it("Doesn't Accept Add Game Request which has missing parameters", function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/add-game',
          body: `{
                  "userId": 2,
                  "type": "True or false",
                  "questions": [
                      {
                          "question": "My name is abdalkl",
                          "answer" : "true"
                      }
                  ]
              }`
        },
        (error, response, body) => {
          if (error) throw error
          assert.strict.equal(JSON.parse(body).statusCode, '2')
          done()
        }
      )
    })
  })

  after(async () => {
    await db.sync({ force: true })
  })
})
