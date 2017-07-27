## 用于推送代码到远程服务器

- 安装

`[npm install receiver-server](https://www.npmjs.com/package/receiver-server)`，**应该安装于服务端，客户端安装请看[receiver-client](https://github.com/w724883/receiver-client)**

- 启动

正常运行`node index`

linux后台运行`nohup node index.js &`

默认8999端口，linux查看8999端口信息`netstat -ap|grep 8999`，kill掉进程id为pid的进程`kill -9 pid`
