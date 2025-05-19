const {loginValidator, googleLogin, githubCallback, checkUserExists, registerUser, setProfile, getProfile,
    resetPassword, listUsers, getUser, createUser, updateUser, deleteUser
} = require('../controller/user')
const {addUser} = require('../controller/user')
const express = require('express')

const router = express.Router()

module.exports = (app) => {
    router.post('/login', loginValidator)
    router.post('/google-login', googleLogin)
    router.post('/register', registerUser)
    router.get('/github/callback', githubCallback)
    router.get('/exists', checkUserExists)
    router.post('/setProfile', setProfile)
    router.get('/getProfile', getProfile)
    router.post('/resetPassword', resetPassword)


    // user management
    router.get('/list', listUsers);
    router.get('/getUser/:id', getUser);
    router.post('/createUser', createUser);
    router.put('/updateUser/:id', updateUser);
    router.delete('/deleteUser/:id', deleteUser);


    app.use('/api/user', router)
}

