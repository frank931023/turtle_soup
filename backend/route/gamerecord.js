const {
    createGameRecord,
    getUserGameRecords,
    getGameRecord,
    updateGameRecord,
    getLeaderboard,
    getUserStats,
    hello
} = require('../controller/gameRecord')
const express = require('express')

const router = express.Router()

module.exports = (app) => {
    // 基本遊戲記錄操作
    router.post('/create', createGameRecord)
    router.get('/history', getUserGameRecords)
    router.get('/record/:id', getGameRecord)
    router.put('/update/:id', updateGameRecord)

    // 排行榜和統計
    router.get('/leaderboard', getLeaderboard)
    router.get('/stats', getUserStats)

    // 測試路由
    router.get('/hello', hello)

    app.use('/api/gameRecord', router)
}
