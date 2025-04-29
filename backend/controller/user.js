const User = require('../model/main.js').User //取得post表ORM


exports.loginValidator = (req, res) => {

}


exports.addUser = async (req, res) => {
    try{
        const {username, password} = req.body
        if(!username || !password){
            return res.status(400).send({
                message: 'Username or password'})
        }
        await User.create({
            username: username,
            password: password,
            role: 'testRole',
        })
        res.status(200).send({
            message: 'Successfully created.',
        })
    } catch(error){
        console.log(error)
        res.status(400).send({
            message: error.message,
        })
    }

}



