// core-modules
const path = require('path')

// third-party-imports
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)

// file-imports
const errorController = require('./controllers/error')
const User = require('./models/user')

// constants
const MONGODB_URI = process.env.MONGODB_URI

const app = express()
const mongodbStore = MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})

app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'a long string as secret',
    resave: false,
    saveUninitialized: false,
    store: mongodbStore,
  })
)

app.use((req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    User.findById(req.session.user._id).then((user) => {
      req.user = user
      next()
    })
  }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

const PORT = process.env.PORT || 3000
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log('Connected!')
    // console.log('result', result)
    // const user = User({
    //   name: 'admin',
    //   email: 'admin@shop',
    //   items: [],
    // })
    // user.save()
    app.listen(PORT)
  })
  .catch((err) => {
    console.log('client_not_connected', err)
  })
