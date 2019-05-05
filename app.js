const express = require('express')
const db = require('./database/config/database')
const Users = require('./database/models/Users')
const Questions = require('./database/models/Questions')
const Games = require('./database/models/Games')

const bodyParser = require('body-parser')
const app = express()

const gamesRoutes = require('./routes/games')

app.use(bodyParser.json())

app.use('/games', gamesRoutes)

app.use((req, res, next) => {
  res.json({
    statusCode: '404'
  })
})
if (process.env.DATABASE_URL) {
  ;(async () => {
    await db.sync({ force: true })

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
  })()
}

app.listen(3000, async () => console.log('App is running on port 3000'))

module.exports = app
