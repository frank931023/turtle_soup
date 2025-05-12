const User = require("../model/main.js").User; //取得post表ORM

const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key_here"; // 這個是用來簽 token 的密鑰，正式上線要放環境變數！


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
          email: user.email,
          role: user.role,
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
exports.addUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({
        message: "Username or password",
      });
    }
    await User.create({
      username: username,
      password: password,
      role: "testRole",
    });
    res.status(200).send({
      message: "Successfully created.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
};

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
        password: "google", // 或其他標記，實際上不會用到
        role: "google_user",
      });
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
          email: user.username,
          role: user.role,
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
        role: 'github_user'
      })
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
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

    // 建立新用戶（未加密版本）
    const newUser = await User.create({ username, password })

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
          email: newUser.email,   // 若有欄位
          role: newUser.role      // 若有欄位
        }
      }
    })

  } catch (error) {
    console.error('註冊錯誤:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}
// where is your register function?
// fuck you
