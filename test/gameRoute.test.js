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

  describe('POST/validate-game', function () {
    // eslint-disable-next-line no-undef
    beforeEach(async () => {
      await db.sync({
        force: true
      })
      await Users.create({
        name: 'Omar',
        email: 'omarelawamry@gmail.com',
        password: 'awamry'
      })

      await Games.create({
        name: 'Name',
        type: 'True or false',
        userId: 1
      })
      await Questions.create({
        question: 'My name is omar',
        answer: 'true',
        gameId: 1
      })
    })

    it('Validates an exisiting game', function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/validate-game',
          body: `{
            "gameId": "1",
            "questions": [
                {
                    "question": "My name is omar",
                    "answer": "true"
                }
            ]
        }`
        },
        (error, response, body) => {
          if (error) throw error
          assert(JSON.parse(body).result)
          done()
        }
      )
    })

    it('Invalidates a Game with missing answer', function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/validate-game',
          body: `
              {
                  "gameId": "2",
                  "questions": [
                     
                  ]
              }`
        },
        (error, response, body) => {
          if (error) throw error
          assert(!JSON.parse(body).result)
          done()
        }
      )
    })

    it("Doesn't validates a missing Game ", function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/validate-game',
          body: `{
            "gameId": "2",
            "questions": [
                {
                    "question": "My name is omar",
                    "answer": "false"
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

    it("Doesn't Accept validate Game Request which has missing parameters", function (done) {
      request.post(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/validate-game',
          body: `{
            "questions": [
                {
                    "question": "My name is omar",
                    "answer": "false"
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

  describe('PUT/ users', function () {
    beforeEach(async () => {
      await db.sync({
        force: true
      })
      await Users.create({
        name: 'Omar',
        email: 'omarelawamry@gmail.com',
        password: 'awamry'
      })

      await Games.create({
        name: 'Name',
        type: 'True or false',
        userId: 1
      })
      await Questions.create({
        question: 'My name is omar',
        answer: 'true',
        gameId: 1
      })
    })
    it('updates an already existing user', function (done) {
      request.put(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/update-user',
          body: `{
            "name":"Omar",
            "email":"newemail@email.com",
            "password":"newpassword"
          }`
        },
        function (error, response, body) {
          if (error) {
            assert(false)
          }
          assert.strict.equal(JSON.parse(body).password, 'newpassword')
          done()
        }
      )
    })

    it('checks for non-existing user update', function (done) {
      request.put(
        {
          headers: { 'content-type': 'application/json' },
          url: 'http://localhost:3000/games/update-user',
          body: `{
            "name":"wrongUser",
            "email":"newemail@email.com",
            "password":"newpassword"
          }`
        },
        function (error, response, body) {
          if (error) {
            throw error
          }

          assert(JSON.parse(body).error)
          done()
        }
      )
    })
  })

  after(async () => {
    await db.sync({ force: true })
  })
})
