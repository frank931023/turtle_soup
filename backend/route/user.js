const {loginValidator} = require('../controller/user')
const {addUser} = require('../controller/user')
const express = require('express')

const router = express.Router()

module.exports = (app) => {
    router.post('/login', loginValidator)
    router.post('/addUser', addUser)

    app.use('/api/user', router)
}

