const express = require('express')
const Games = require('../database/models/Games')
const Users = require('../database/models/Users')
const Questions = require('../database/models/Questions')
const router = express.Router()

// /games/validate-game => POST
router.post('/validate-game', async (req, res, next) => {
  let userReq = req.body
  // check for parms
  if (userReq.gameId && userReq.questions.length > 0) {
    // checking if game exists
    const game = await Games.findOne({
      include: [
        {
          model: Questions,
          where: { gameId: userReq.gameId }
        }
      ]
    })

    if (game) {
      if (userReq.questions.length !== game.questions.length) {
        res.json({
          result: false
        })
      } else {
        let result = true
        userReq.questions.forEach(userQuestion => {
          game.questions.forEach(gameQuestion => {
            if (userQuestion.question === gameQuestion.question) {
              result = result && userQuestion.answer === gameQuestion.answer
            }
          })
        })
        res.json({
          result
        })
      }
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

router.put('/update-user', async (req, res, next) => {
  let newUser = req.body

  if (newUser.name && newUser.email && newUser.password) {
    const user = await Users.findOne({
      where: {
        name: newUser.name
      }
    })
    if (user) {
      await Users.destroy({
        where: {
          name: newUser.name
        }
      })
      newUser = await Users.create({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      })
      res.json(newUser)
    } else {
      res.json({
        error: '404'
      })
    }
  } else {
    res.json({
      error: '442'
    })
  }
})

// /Games/get-game/:id => GET
router.get('/get-game/:id', async (req, res, next) => {
  let reqGameId = req.params.id

  const game = await Games.findOne({
    attributes: ['name', 'type'],
    include: [
      {
        model: Questions,
        attributes: ['question'],
        where: { gameId: reqGameId }
      }
    ]
  })
  // if  game is found
  if (game) {
    res.json(game)
  } else {
    // if game is not found
    res.json({
      error: '-1'
    })
  }
})

router.delete('/delete-game/:id', async (req, res, next) => {
  await Users.create({
    name: 'omar',
    email: 'awamry@awamry.com',
    password: 'amrex'
  })

  let reqGameId = req.params.id
  const game = await Games.findOne({
    where: {
      id: reqGameId
    }
  })

  if (game) {
    const questions = await Questions.findAll({
      where: {
        gameId: reqGameId
      }
    })
    if (questions) {
      await Questions.destroy({
        where: {
          gameId: reqGameId
        }
      })
      await Games.destroy({
        where: {
          id: reqGameId
        }
      })
    }
    res.json({
      game
    })
  } else {
    res.json({
      error: '404'
    })
  }
})

module.exports = router
