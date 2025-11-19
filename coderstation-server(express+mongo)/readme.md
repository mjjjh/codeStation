# 数据库导入

- 服务器端 mongodb 配置文件修改监听 ip，需要是内网的 IP，不是公网。
- mongorestore --host 公网 IP --port 端口号 --db 数据库名 --username 用户名 --password 密码 --authenticationDatabase 数据库名 需要导入的数据
