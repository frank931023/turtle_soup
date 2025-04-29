const User = require('../model/main.js').User //取得post表ORM

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key_here';  // 這個是用來簽 token 的密鑰，正式上線要放環境變數！

exports.loginValidator = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 檢查有沒有帶 username 和 password
        if (!username || !password) {
            return res.status(400).send({
                message: '缺少用戶名稱或密碼'
            });
        }

        // 查詢資料庫有沒有這個 username
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).send({
                message: '用戶未找到'
            });
        }

        // 檢查密碼（這裡只是直接比對文字，實務上應該要用 bcrypt）
        if (user.password !== password.toString()) {
            return res.status(401).send({
                message: '密碼不正確'
            });
        }

        // 如果通過驗證
        // 登入成功，產生 token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: '2h' } // token 2小時內有效
        );

        // 回傳 token 和 user資料
        res.status(200).send({
            message: 'Login successful',
            result: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            }

        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Internal server error',
            error: error.message
        });
    }
};


//  add user (for testing)
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



