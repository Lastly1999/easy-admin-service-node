# 获取node镜像
FROM node:16

# 创建工作目录
RUN mkdir app

# 设置工作目录
WORKDIR /app

# 拷贝目录
COPY . /app

# 镜像的维护者
MAINTAINER zhangzw

# 安装pnpm包
RUN npm i -g pnpm@6

# 安装依赖
RUN pnpm install

# 安装全局pm2
RUN pnpm add -g pm2

# 编译
RUN pnpm run build

# 容器端口
EXPOSE 5000

# 启动命令
CMD ["pm2-runtime", "start", "dist/src/main.js", "-i", "2"]

