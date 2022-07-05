FROM node:14.11.0
RUN mkdir /usr/share/node
COPY ./dist /usr/share/node/dist
COPY ./node_modules /usr/share/node/node_modules
WORKDIR /usr/share/node

ENV HOST 0.0.0.0
ENV PORT 2999
# 开放端口
EXPOSE 2999
# 容器启动命令
CMD ["node","dist/main.js"]