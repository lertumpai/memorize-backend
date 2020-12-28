FROM node:lts

ENV NODE_ENV="production"
ENV PRIVATE_KEY="n@e#w$f%a^r&m*m(e)m_o+r1i2z3e4567890"
ENV PRIVATE_HASH_KEY="$2b$10$OCSYVJ2HwOQ5iDA/U7ZjreK3OEdUzoCclByN0MPOkxy9UwPrJSW8m"
ENV MONGO_URI="mongodb+srv://sorawit5171718:sorawit5171718@cluster0.oze7f.mongodb.net/memorize?retryWrites=true&w=majority"

# set a directory for the app
WORKDIR /usr/src/memorize

# copy all the files to the container
COPY package.json /usr/src/memorize

RUN npm install

COPY . /usr/src/memorize

# tell the port number the container should expose
EXPOSE 3000

# run the command
CMD ["npm", "run", "start"]
