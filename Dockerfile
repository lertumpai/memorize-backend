FROM node:lts

ENV NODE_ENV=$NODE_ENV
ENV PRIVATE_KEY=$PRIVATE_KEY
ENV PRIVATE_HASH_KEY=$PRIVATE_HASH_KEY
ENV MONGO_URI=$MONGO_URI

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
