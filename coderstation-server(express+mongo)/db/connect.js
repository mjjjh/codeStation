/**
 * 该文件负责连接数据库
 */

const mongoose = require("mongoose");

// 从环境变量读取配置（确保配置文件已正确加载，比如用 dotenv 库）
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

// 拼接 MongoDB 连接字符串（含认证信息，关键！）
// 格式：mongodb://用户名:密码@主机:端口/数据库名?authSource=认证库
const dbURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_NAME}`;

// 连接配置（MongoDB 7.0+ 推荐的配置，移除过时参数）
const connectOptions = {
  // useNewUrlParser 和 useUnifiedTopology 在 mongoose 6+ 已默认启用，无需重复写
  // 新增：避免 deprecated 警告的配置（可选，根据 mongoose 版本调整）
  serverSelectionTimeoutMS: 5000, // 连接超时时间（5秒）
  authMechanism: "SCRAM-SHA-1"    // 明确认证机制（MongoDB 默认，兼容你的版本）
};

// // 定义链接数据库字符串
// const dbURI = "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;
// const dbURI = "mongodb://localhost:27017/coderstation";

// 连接
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.catch((err) => {
  console.log(`coderstation 数据库连接失败...`+err);
});

// 监听
mongoose.connection.on("connected", function () {
  console.log(`coderstation 数据库已经连接...`);
});
