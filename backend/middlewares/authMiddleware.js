// token 的密鑰，之後要用.env環境變數，這邊先偷懶ㄋ 和登入時要用密碼一樣
const SECRET_KEY = '09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7';

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: '未提供身份驗證令牌'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Add user info to request
        req.user = {
            id: decoded.id
        };

        next();
    } catch (error) {
        console.error('身份驗證錯誤:', error);
        res.status(401).json({
            status: 'error',
            message: '身份驗證失敗'
        });
    }
};

module.exports = auth;
