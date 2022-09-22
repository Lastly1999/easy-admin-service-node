# 基础镜像
FROM keymetrics/pm2:latest-alpine

# 创建一个应用目录
WORKDIR /usr/src/app

# 这个星号通配符意思是复制package.json和package-lock.json,复制到当前应用目录
COPY package*.json ./

# 安装应用依赖
RUN npm i -g yarn

# 安装完毕后复制当前目录所有文件到镜像目录里面
COPY . . 

# 执行npm run build 后生成dist目录
RUN yarn build

# 安装pm2
RUN yarn add global pm2

# 使用打包后的镜像
CMD ["pm2-runtime","start","dist/main.js"]