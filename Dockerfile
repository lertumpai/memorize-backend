FROM node:lts

ARG NODE_ENV="production"
ENV NODE_ENV="${NODE_ENV}"

ARG PRIVATE_KEY="n@e#w$f%a^r&m*m(e)m_o+r1i2z3e4567890"
ENV PRIVATE_KEY="${PRIVATE_KEY}"

ARG PRIVATE_HASH_KEY="$2b$10$OCSYVJ2HwOQ5iDA/U7ZjreK3OEdUzoCclByN0MPOkxy9UwPrJSW8m"
ENV PRIVATE_HASH_KEY="${PRIVATE_HASH_KEY}"

ARG MONGO_URI="mongodb://localhost:27017/memorize"
ENV MONGO_URI="${MONGO_URI}"

# set a directory for the app
WORKDIR /usr/src/memorize-backend

# copy all the files to the container
COPY package.json /usr/src/memorize-backend

RUN npm install

COPY . /usr/src/memorize-backend

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start"]
