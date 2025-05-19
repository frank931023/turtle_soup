const {
    createGameRecord,
    getUserGameRecords,
    getGameRecord,
    updateGameRecord,
    getLeaderboard,
    getUserStats,
    hello
} = require('../controller/gamerecord')

const auth = require('../middlewares/authMiddleware');

const express = require('express')

const router = express.Router()

module.exports = (app) => {
    // 基本遊戲記錄操作
    router.post('/create',auth, createGameRecord)
    router.get('/history',auth, getUserGameRecords)
    router.get('/record/:id',auth, getGameRecord)
    router.put('/update/:id',auth, updateGameRecord)

    // 排行榜和統計
    router.get('/leaderboard',auth, getLeaderboard)
    router.get('/stats',auth, getUserStats)

    // 測試路由
    router.get('/hello',auth, hello)

    app.use('/api/gameRecord', router)
}
