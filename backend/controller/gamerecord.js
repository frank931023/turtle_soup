// db ORM
const db = require("../models");
const GameRecord = db.gamerecord;

// 創建遊戲記錄
exports.createGameRecord = async (req, res) => {
    const { questionId, score, userAnswer, isCompleted, timeSpent } = req.body;
    const userId = req.user.id; // 假設使用者 ID 從 auth middleware 獲取

    try {
        const gameRecord = await GameRecord.create({
            userId,
            questionId,
            score,
            userAnswer,
            isCompleted,
            timeSpent,
            createdAt: new Date()
        });

        res.status(201).json({
            status: "success",
            data: gameRecord
        });
    } catch (error) {
        console.error("創建遊戲記錄錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 獲取用戶遊戲記錄
exports.getUserGameRecords = async (req, res) => {
    const userId = req.user.id; // 從 auth middleware 獲取

    try {
        const gameRecords = await GameRecord.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            status: "success",
            data: gameRecords
        });
    } catch (error) {
        console.error("獲取遊戲記錄錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 獲取特定遊戲記錄
exports.getGameRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const gameRecord = await GameRecord.findByPk(id);

        if (!gameRecord) {
            return res.status(404).json({
                status: "error",
                message: "找不到該遊戲記錄"
            });
        }

        res.json({
            status: "success",
            data: gameRecord
        });
    } catch (error) {
        console.error("獲取遊戲記錄錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 更新遊戲記錄（例如更新分數或通關狀態）
exports.updateGameRecord = async (req, res) => {
    const { id } = req.params;
    const { score, isCompleted, timeSpent } = req.body;

    try {
        const gameRecord = await GameRecord.findByPk(id);

        if (!gameRecord) {
            return res.status(404).json({
                status: "error",
                message: "找不到該遊戲記錄"
            });
        }

        // 更新記錄
        await gameRecord.update({
            score,
            isCompleted,
            timeSpent
        });

        res.json({
            status: "success",
            data: gameRecord
        });
    } catch (error) {
        console.error("更新遊戲記錄錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 獲取排行榜
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await GameRecord.findAll({
            attributes: [
                'userId',
                [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'gamesPlayed']
            ],
            group: ['userId'],
            order: [[db.Sequelize.literal('totalScore'), 'DESC']],
            limit: 10
        });

        res.json({
            status: "success",
            data: leaderboard
        });
    } catch (error) {
        console.error("獲取排行榜錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 獲取用戶的遊戲統計
exports.getUserStats = async (req, res) => {
    const userId = req.user.id;

    try {
        const stats = await GameRecord.findAll({
            where: { userId },
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'gamesPlayed'],
                [db.Sequelize.fn('AVG', db.Sequelize.col('timeSpent')), 'avgTimeSpent'],
                [db.Sequelize.fn('COUNT', db.Sequelize.literal('CASE WHEN "isCompleted" = true THEN 1 END')), 'completedGames']
            ]
        });

        res.json({
            status: "success",
            data: stats[0]
        });
    } catch (error) {
        console.error("獲取用戶統計錯誤:", error);
        res.status(500).json({ error: error.message });
    }
};

// 測試 API
exports.hello = (req, res) => {
    res.json({ message: "遊戲記錄系統正常運作中！" });
};
