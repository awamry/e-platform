const express = require('express')
const Games = require('../database/models/Games')
const Users = require('../database/models/Users')
const Questions = require('../database/models/Questions')
const router = express.Router()

// /games/add-game => POST
router.post('/add-game', async (req, res, next) => {
  // we didn't implment user authentication yet so we will use pass user id as param
  let game = req.body
  // check for parms
  if (game.userId && game.name && game.type && game.questions.length > 0) {
    // checking if id exists
    const user = await Users.findOne({
      where: {
        id: game.userId
      }
    })

    if (user) {
      let insertedGame = await Games.create({
        name: game.name,
        type: game.type,
        userId: game.userId
      })

      game.questions.forEach(async question => {
        await Questions.create({
          question: question.question,
          answer: question.answer,
          gameId: insertedGame.dataValues.id
        })
      })
      res.json({
        statusCode: '1'
      })
    } else {
      res.json({
        statusCode: '-1'
      })
    }
  } else {
    res.json({
      // missing pram code
      statusCode: '2'
    })
  }
})

module.exports = router
