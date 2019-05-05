/* eslint-disable node/no-deprecated-api */
/* eslint-disable no-undef */
const assert = require('assert')
const db = require('../database/config/database')
const Users = require('../database/models/Users')
const Games = require('../database/models/Games')
const Questions = require('../database/models/Questions')

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await db.sync({
    force: true
  })
})
after(async () => {
  await db.sync({ force: true })
})
describe('Database', () => {
  it('Connects to the database', async () => {
    try {
      await db.authenticate()
      assert(true)
    } catch (e) {
      assert(false)
    }
  })

  describe('Users Table', () => {
    it('Adds new user', async () => {
      await Users.create({
        name: 'omar',
        email: 'awamry@awamry.com',
        password: 'awamry'
      })

      const user = await Users.findOne({
        where: {
          password: 'awamry'
        }
      })
      assert.equal(user.password, 'awamry')
    })
  })
  describe('Games Table', () => {
    it('Adds a new game ', async () => {
      await Users.create({
        name: 'omar',
        email: 'awamry@awamry.com',
        password: 'awamry'
      })

      const user = await Users.findOne({
        where: {
          password: 'awamry'
        }
      })
      await Games.create({
        name: 'Game1',
        type: 'True or False',
        userId: user.id
      })
      const game = await Games.findOne({
        where: {
          name: 'Game1'
        }
      })
      assert.equal(game.type, 'True or False')
    })
  })
  describe('Questions Table', () => {
    it('Adds a new question ', async () => {
      await Users.create({
        name: 'omar',
        email: 'awamry@awamry.com',
        password: 'awamry'
      })

      const user = await Users.findOne({
        where: {
          password: 'awamry'
        }
      })

      await Games.create({
        name: 'Game1',
        type: 'True or False',
        userId: user.id
      })

      const game = await Games.findOne({
        where: {
          name: 'Game1'
        }
      })

      await Questions.create({
        question: 'My name is awamry',
        answer: 'True',
        gameId: game.id
      })

      const question = await Questions.findOne({
        where: {
          question: 'My name is awamry'
        }
      })
      // console.log(question)

      assert.equal(question.answer, 'True')
    })
  })
})
