# # 获取node镜像
# FROM node:16

# # 创建工作目录
# RUN mkdir app

# # 设置工作目录
# WORKDIR /app

# # 拷贝目录
# COPY . /app


# # 安装依赖
# RUN npm install

# # 安装全局pm2
# RUN npm i -g pm2

# # 编译
# RUN npm run build




# # 容器端口
# EXPOSE 5000

# # 启动命令
# CMD ["node", "dist/src/main.js"]


# 基础镜像
FROM node:16
# 创建一个应用目录
WORKDIR /usr/src/app
# 这个星号通配符意思是复制package.json和package-lock.json,复制到当前应用目录
COPY package*.json ./
# 安装应用依赖
RUN npm install
# 安装完毕后复制当前目录所有文件到镜像目录里面
COPY . . 
# 执行npm run build 后生成dist目录
RUN npm run build
# 使用打包后的镜像
CMD ["node","dist/main.js"]