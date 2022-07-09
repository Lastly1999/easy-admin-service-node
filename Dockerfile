# 获取node镜像
FROM node:14

# 创建工作目录
RUN mkdir app

# 设置工作目录
WORKDIR /app

# 拷贝目录
COPY . /app

# 镜像的维护者
MAINTAINER zhangzw

# 安装npm包
RUN npm --registry https://registry.npm.taobao.org i

# 安装全局pm2
RUN npm --registry https://registry.npm.taobao.org i -g pm2

# 编译
RUN npm run build

# 容器端口
EXPOSE 3000

# 启动命令
CMD ["pm2-runtime", "start", "dist/src/main.js", "-i", "2"]

