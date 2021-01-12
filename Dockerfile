FROM node:lts

# set a directory for the app
WORKDIR /usr/src/memorize-backend

# copy all the files to the container
COPY package.json /usr/src/memorize-backend

RUN npm install

COPY . /usr/src/memorize-backend

RUN npm run build
RUN npm prune --production

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start:prod"]
