const User = require("../model/main.js").User; //取得post表ORM
const { Op } = require('sequelize');

const jwt = require("jsonwebtoken");
const SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"; // 這個是用來簽 token 的密鑰，正式上線要放環境變數！


// google Oauth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // 環境變數
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);


const axios = require('axios')
exports.loginValidator = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 檢查有沒有帶 username 和 password
    if (!username || !password) {
      return res.status(400).send({
        message: "缺少用戶名稱或密碼",
      });
    }

    // 查詢資料庫有沒有這個 username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send({
        message: "用戶未找到",
      });
    }

    // 檢查密碼（這裡只是直接比對文字，實務上應該要用 bcrypt）
    if (user.password !== password.toString()) {
      return res.status(401).send({
        message: "密碼不正確",
      });
    }

    // 如果通過驗證
    // 登入成功，產生 token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: "2h" } // token 2小時內有效
    );

    // 回傳 token 和 user資料
    res.status(200).send({
      message: "Login successful",
      result: {
        token: token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          score: user.score,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//  add user (for testing)


exports.googleLogin = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    console.log(ticket);
    const payload = ticket.getPayload();
    const { email, name } = payload;


    let user = await User.findOne({ where: { username: email } });
    if (!user) {
      user = await User.create({
        username: email,
        password: 'google',
        role: "user",
        name: null,
        sex: null,
        email: null,
        avatarUrl: null,
      })
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "2h" }
    );

    res.status(200).send({
      message: "Google登入成功！",
      result: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          score: user.score,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (err) {
    res.status(401).send({
      message: "Google登入失敗！",
      error: err.message,
    });
  }
};







// 導入環變數的Oauth ID們
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI
} = process.env

exports.githubCallback = async (req, res) => {
  const { code } = req.query
  // console.log(code)
  try {
    // 1. 用 code 換 access_token
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    }, {
      headers: { Accept: 'application/json' }
    })
    // console.log('GitHub 換 token 回傳內容:', tokenRes.data)


    const accessToken = tokenRes.data.access_token
    if (!accessToken) throw new Error('無法取得 GitHub Token')

    // 2. 拿 token 取得使用者資料
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    const { login, id, avatar_url } = userRes.data
    const username = `github_${id}`

    let user = await User.findOne({ where: { username } })
    if (!user) {
      user = await User.create({
        username,
        password: 'github',
        role: "user",
        name: null,
        sex: null,
        email: null,
        avatarUrl: null,
      })
    }

    console.log(user.name)
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, score: user.score, name: user.name, avatarUrl: user.avatarUrl  },
        SECRET_KEY,
        { expiresIn: '2h' }
    )

    // 3. 導回前端並附上 token（可改為儲存在 Cookie）
    res.redirect(`http://localhost:5174/oauth?token=${token}`)
    // console.log('redirected')

  } catch (e) {
    console.error('GitHub 換 token 錯誤:', e.response?.data || e.message)
    return res.status(500).send({ message: 'Token 交換失敗', error: e.message })
  }
}


exports.checkUserExists = async (req, res) => {
  try {
    const { username } = req.query
    const exists = await User.findOne({ where: { username } })
    res.json({
      result: {
        exists: !!exists
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '伺服器錯誤' })
  }
}



// 註冊函數
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '缺少用戶名稱或密碼' })
    }

    // 檢查是否已存在
    const existingUser = await User.findOne({ where: { username } })
    if (existingUser) {
      return res.status(409).json({ message: '用戶名已被註冊' })
    }

    // 建立新用戶（未加密版本，含預設值）
    const newUser = await User.create({
      username,
      password,
      role: "user",
      name: null,
      sex: null,
      email: null,
      avatarUrl: null,
    })

    // 簽發 JWT
    const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role // 可選，如果有定義
        },
        SECRET_KEY,
        { expiresIn: '2h' }
    )

    // 回傳格式一致
    res.status(201).json({
      message: '註冊成功',
      result: {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          score: newUser.score,
          role: newUser.role,      // 若有欄位
          avatarUrl: newUser.avatarUrl,
          name: newUser.name,
        }
      }
    })

  } catch (error) {
    console.error('註冊錯誤:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

// 設定個人資料 API
exports.setProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "缺少授權標頭" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const { sex, name, email, avatarUrl } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "找不到使用者" });
    }

    // 僅更新有提供的欄位
    if (sex !== undefined) user.sex = sex;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

    await user.save();

    res.status(200).send({
      message: "個人資料更新成功",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        sex: user.sex,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("設定個人資料錯誤:", error);
    res.status(500).send({ message: "內部伺服器錯誤", error: error.message });
  }
};



// 取得個人公開資料 API
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "缺少授權標頭" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "找不到使用者" });
    }
    console.log(user.email);
    res.status(200).send({
      message: "取得個人資料成功",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        sex: user.sex,
        score: user.score,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("取得個人資料錯誤:", error);
    res.status(500).send({ message: "內部伺服器錯誤", error: error.message });
  }
};




// 密碼重設 API（明文比對版本）
exports.resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "缺少授權標頭" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send({ message: "請提供舊密碼與新密碼" });
    }

    const user = await User.findByPk(userId);
    console.log(user.password)
    if (!user) {
      return res.status(404).send({ message: "找不到使用者" });
    }

    if (user.password !== oldPassword) {
      return res.status(400).send({ message: "舊密碼不正確" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({ message: "密碼更新成功" });
  } catch (error) {
    console.error("密碼重設錯誤:", error);
    res.status(500).send({ message: "內部伺服器錯誤", error: error.message });
  }
};




// controllers/userController.js


// 获取用户列表
exports.listUsers = async (req, res) => {
  try {
    const { role, search, page = 1, pageSize = 10 } = req.query;

    // 构建查询条件
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // 分页查询
    const { rows: users, count } = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'name', 'email', 'role', 'score', 'avatarUrl', 'createdAt'],
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize)
    });

    res.status(200).json({
      message: "获取用户列表成功",
      result: {
        users,
        pagination: {
          total: count,
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      }
    });
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      message: "服务器错误",
      error: error.message
    });
  }
};

// 创建新用户
exports.createUser = async (req, res) => {
  try {
    const { username, password, role, name, email, avatarUrl } = req.body;

    // 验证请求数据
    if (!username || !password) {
      return res.status(400).json({ message: "用户名和密码为必填项" });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: "用户名已存在" });
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      password,
      role: role || 'user',
      name,
      email,
      score: 0,
      avatarUrl
    });

    res.status(201).json({
      message: "创建用户成功",
      result: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({
      message: "服务器错误",
      error: error.message
    });
  }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name, email, score, avatarUrl } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 更新用户信息
    await user.update({
      role: role || user.role,
      name: name || user.name,
      email: email || user.email,
      score: score || user.score,
      avatarUrl: avatarUrl
    });

    res.status(200).json({
      message: "更新用户成功",
      result: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
        score: user.score,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({
      message: "服务器错误",
      error: error.message
    });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    await user.destroy();

    res.status(200).json({
      message: "删除用户成功"
    });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      message: "服务器错误",
      error: error.message
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 找到用户
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'username',
        'name',
        'email',
        'role',
        'score',
        'avatarUrl',
        'sex',
        'createdAt'
      ]
    });

    // 检查用户是否存在
    if (!user) {
      return res.status(404).json({
        message: "找不到该用户"
      });
    }

    // 返回用户信息
    res.status(200).json({
      message: "获取用户信息成功",
      result: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
          score: user.score,
          sex: user.sex,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      message: "服务器错误",
      error: error.message
    });
  }
};



exports.addScore = async (req, res) => {
  try {
    // 從請求中獲取用戶 ID 和要添加的分數
    const { id } = req.params;
    const { score } = req.body;

    // 確保分數是數字且有意義
    if (score === undefined || isNaN(Number(score))) {
      return res.status(400).send({ message: "請提供有效的分數" });
    }

    // 查詢用戶
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "找不到用戶" });
    }

    // 計算新分數 (確保分數永遠不會低於 0)
    const newScore = Math.max(0, Number(user.score) + Number(score));

    // 更新用戶分數
    user.score = newScore;
    await user.save();

    // 返回成功和更新後的分數
    res.status(200).send({
      message: "分數更新成功",
      result: {
        id: user.id,
        username: user.username,
        previousScore: Number(user.score) - Number(score),
        scoreAdded: Number(score),
        currentScore: newScore
      }
    });

  } catch (error) {
    console.error("加分 API 錯誤:", error);
    res.status(500).send({
      message: "內部伺服器錯誤",
      error: error.message
    });
  }
};
