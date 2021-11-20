// core-modules
const path = require('path')

// third-party-imports
const express = require('express')
const bodyParser = require('body-parser')

// file-imports
const errorController = require('./controllers/error')
const { mongoConnect } = require('./util/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   User.findByPk(1)
//     .then((user) => {
//       req.user = user
//       next()
//     })
//     .catch((err) => console.log('__error_attaching_user_to_request__', err))
// })

app.use('/admin', adminRoutes)
app.use(shopRoutes)

// app.use(errorController.get404)

mongoConnect((client) => {
  // console.log('client: ', client)
  app.listen(3000)
})
