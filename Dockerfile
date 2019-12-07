FROM node:alpine
WORKDIR /home/node/app
COPY . .
RUN npm install
EXPOSE 8000
ENTRYPOINT ["/home/node/app/docker-entrypoint.sh"]
