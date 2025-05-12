const {loginValidator, googleLogin, githubCallback, checkUserExists, registerUser} = require('../controller/user')
const {addUser} = require('../controller/user')
const express = require('express')

const router = express.Router()

module.exports = (app) => {
    router.post('/login', loginValidator)
    router.post('/addUser', addUser)
    router.post('/google-login', googleLogin)
    router.post('/register', registerUser)
    router.get('/github/callback', githubCallback)
    router.get('/exists', checkUserExists)


    app.use('/api/user', router)
}

