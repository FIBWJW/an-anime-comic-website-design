const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

// 引入cookie 依赖
let cookie = require("cookie-parser")
// 引入session 依赖
let session = require("express-session")
// 引入路由文件
let router = require("./router/index")
// 可自动打开浏览器模块
const cp = require("child_process");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// 设置MySQL连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'FIBWJW',
    password: '123456',
    database: 'account'
});

db.connect((err) => {
    if (err) {
        console.error('数据库连接失败: ' + err.stack);
        return;
    }
    console.log('已连接数据库');
});

// 添加处理根路径的路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.post('/register', (req, res) => {
    const { username, phone, password } = req.body;

    // 简单的用户名重复检查
    db.query('SELECT * FROM information WHERE username = ?', [username], (err, results) => {
        if (err) {
            res.json({ success: false, message: '数据库查询失败' });
            return;
        }

        if (results.length > 0) {
            res.json({ success: false, message: '用户名已存在' });
            return;
        }

        // 插入新用户
        const sql = 'INSERT INTO information (username, phone, password) VALUES (?, ?, ?)';
        db.query(sql, [username, phone, password], (err, result) => {
            if (err) {
                res.json({ success: false, message: '注册失败' });
                return;
            }
            res.json({ success: true });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM information WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('数据库查询失败: ', err);
            res.json({ success: false, message: '数据库查询失败' });
            return;
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: '用户名或密码错误' });
        }
    });
});

// 新增修改密码的路由
app.post('/changePassword', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    const sql = 'SELECT * FROM information WHERE username = ? AND password = ?';
    db.query(sql, [username, oldPassword], (err, results) => {
        if (err) {
            console.error('数据库查询失败: ', err);
            res.json({ success: false, message: '数据库查询失败' });
            return;
        }

        if (results.length > 0) {
            // 更新密码
            const updateSql = 'UPDATE information SET password = ? WHERE username = ?';
            db.query(updateSql, [newPassword, username], (err, result) => {
                if (err) {
                    console.error('更新密码失败: ', err);
                    res.json({ success: false, message: '更新密码失败' });
                    return;
                }
                res.json({ success: true, message: '密码修改成功' });
            });
        } else {
            res.json({ success: false, message: '旧密码不正确' });
        }
    });
});

// 处理上传头像的路由
app.post('/api/upload-avatar', (req, res) => {
    const { avatarPath, username } = req.body;

    const sql = 'UPDATE information SET avatar = ? WHERE username = ?';
    db.query(sql, [avatarPath, username], (err, result) => {
        if (err) {
            console.error('更新数据库时出错: ' + err.stack);
            return res.status(500).json({ success: false, message: '头像上传失败' });
        }
        res.json({ success: true, avatarUrl: avatarPath });
    });
});

// 处理上传签名的路由
app.post('/changeSignature', (req, res) => {
    const { username, newSignature } = req.body;

    const sql = 'UPDATE information SET signature = ? WHERE username = ?';
    db.query(sql, [newSignature, username], (err, result) => {
        if (err) {
            console.error('数据库更新失败: ', err);
            res.json({ success: false, message: '数据库更新失败' });
            return;
        }
        res.json({ success: true });
    });
});

app.post('/getUserInfo', (req, res) => {
    const { username } = req.body;

    const sql = 'SELECT signature FROM information WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('数据库查询失败: ', err);
            res.json({ success: false, message: '数据库查询失败' });
            return;
        }

        if (results.length > 0) {
            const signature = results[0].signature;
            res.json({ success: true, signature: signature });
        } else {
            res.json({ success: false, message: '未找到用户信息' });
        }
    });
});

// 处理获取用户头像的路由
app.get('/api/get-avatar', (req, res) => {
    const { username } = req.query;

    const sql = 'SELECT avatar FROM information WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('查询数据库时出错: ' + err.stack);
            return res.status(500).json({ success: false, message: '获取用户头像失败' });
        }

        if (results.length > 0) {
            const avatarUrl = results[0].avatar;
            res.json({ success: true, avatarUrl });
        } else {
            res.json({ success: false, message: '未找到用户头像' });
        }
    });
});


// 设置路由以处理搜索请求
app.get('/search', (req, res) => {
    const keyword = req.query.query;
  
    if (!keyword) {
      return res.status(400).json({ error: '关键字不能为空' });
    }
  
    const query = `SELECT name, img, html FROM comic WHERE name LIKE ?`;
    const values = [`%${keyword}%`];
  
    db.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ error: '数据库查询出错' });
      }
  
      res.json(results);
    });
  });


// GET 请求接口，用于获取点击量
app.get('/getClickCount', (req, res) => {
    const animeName = req.query.animeName;

    // 查询数据库获取点击量
    const sql = 'SELECT click_count FROM comic WHERE name = ?';
    db.query(sql, [animeName], (err, result) => {
        if (err) {
            console.error('Error querying click count:', err.stack);
            res.status(500).json({ message: 'Error querying click count' });
            return;
        }

        if (result.length > 0) {
            const clickCount = result[0].click_count;
            res.status(200).json({ clickCount });
        } else {
            res.status(404).json({ message: 'Comic not found' });
        }
    });
});


// 路由：获取动漫排行榜数据
app.get('/api/comics/rankings', (req, res) => {
    // 查询数据库获取排行数据
    const sql = 'SELECT name, click_count FROM comic ORDER BY click_count DESC';
    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving rankings from database:', error);
            res.status(500).json({ error: 'Failed to retrieve rankings' });
            return;
        }
        res.json(results); // 将结果以JSON格式返回
    });
});

app.post('/record-history', (req, res) => {
    const { comic_id, name, img, html } = req.body;

    const query = 'INSERT INTO browsing_history (comic_id, name, img, html) VALUES (?, ?, ?, ?)';
    const values = [comic_id, name, img, html];

    db.query(query, values, (error, result) => {
        if (error) {
            return res.status(500).json({ error: '数据库错误' });
        }
        res.json({ success: true });
    });
});

// 获取用户浏览历史记录
app.get('/browse-history', (req, res) => {
    const query = 'SELECT * FROM browsing_history ORDER BY viewed_at DESC';

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: '数据库错误' });
        }
        res.json(results);
    });
});


// 使用 express解析常用的请求体
app.use(express.urlencoded({
    extended: false
  }))
  app.use(express.json())
  // 添加cookie、session依赖
  app.use(cookie())
  app.use(session({
    secret: "node-demo",
    resave: true,
    cookie: {
      // 过期时间
      maxAge: 1000 * 30 * 60
    },
    saveUninitialized: true,
    rolling: true //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
  }))
  
  // 使用路由
  app.use(router)
  
  // 处理未定义的路由
  app.use((req, res) => {
    res.status(404).json({ error: '未找到相关页面' });
  });
  
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
})

