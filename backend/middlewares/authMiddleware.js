const jwt = require('jsonwebtoken');

// token 的密鑰，之後要用.env環境變數，這邊先偷懶ㄋ 和登入時要用密碼一樣
const SECRET_KEY = '09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7';

const authMiddleware = (req, res, next) => {
    // 從 headers 抓出 Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: '缺少授權(token)資訊' });
    }

    // 取得 token 部分，格式是 "Bearer token字串"
    const token = authHeader.split(' ')[1];

    try {
        // 驗證 token
        const decoded = jwt.verify(token, SECRET_KEY);

        // 驗證成功，把 user 資訊存到 req.user 上，給後面的 API 用
        req.user = decoded;

        next(); // 重要！放行，讓請求繼續往下
    } catch (error) {
        return res.status(403).send({ message: 'Token 驗證失敗或過期' });
    }
};

module.exports = authMiddleware;
