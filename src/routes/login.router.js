const express = require('express')
const { login } = require('../controllers/login.controller')
const router = express.Router()
const auth = require('../auth/auth')
//const login = require('../controllers/login.controller')

router.post('/',auth, login)

module.exports = router