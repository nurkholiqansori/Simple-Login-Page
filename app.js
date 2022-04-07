const express = require('express')
const router = express.Router()
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('./config/passport')(passport)

const urlDB = 'mongodb://localhost:27017/loginapp'
const portServer = 3000

// Database
mongoose
  .connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('\x1b[33mMongoDB Connected...\x1b[0m'))
  .catch((err) => console.log(err))

//Extensi File
app.set('view engine', 'ejs')
app.use(expressEjsLayout)
app.use(express.urlencoded({ extended: false }))

//Pesan Sesi
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

//Percabangan
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use(express.static(path.join(__dirname, 'src')))

app.listen(portServer, () =>
  console.log('Server is running on port \x1b[35m' + portServer),
)
