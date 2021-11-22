// core-modules
const path = require('path')

// third-party-imports
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// file-imports
const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

// Routes
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  User.findById('619a034d711c3966da0c05b2').then((user) => {
    req.user = user
    next()
  })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

mongoose
  .connect(
    'mongodb+srv://pulkit:OnhmMgr8fEqagTZs@cluster0.qgwii.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then((result) => {
    console.log('Connected!')
    // console.log('result', result)
    // const user = User({
    //   name: 'admin',
    //   email: 'admin@shop',
    //   items: [],
    // })
    // user.save()
    app.listen(3000)
  })
  .catch((err) => {
    console.log('client_not_connected', err)
  })
