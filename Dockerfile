FROM node:14-alpine as builder
WORKDIR /app
COPY . .
RUN rm -f -r node_modules package-lock.json Dockerfile

RUN npm install --production
RUN npm install -g @vercel/ncc
RUN ncc build server.js -o dist

FROM node:14-alpine
ENV HOME=/home/node
WORKDIR $HOME/app
RUN apk add --no-cache redis
COPY --from=builder /app/dist/index.js .
RUN npm install mysql2
# COPY --from=builder /app .

USER node
EXPOSE 3030
EXPOSE 6379
# CMD ["node index.js & redis-server"]
CMD redis-server & node index.js