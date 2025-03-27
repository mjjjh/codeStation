/**
 * 该文件负责连接数据库
 */

const mongoose = require("mongoose");

// 定义链接数据库字符串
const dbURI = "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;
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
