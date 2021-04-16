FROM node:lts

# set a directory for the app
WORKDIR memorize-backend

# copy all the files to the container
COPY package.json memorize-backend

RUN npm install

COPY . memorize-backend

# build file (transpile to nodejs current version)
RUN npm run build
RUN npm prune --production

# remove floder src
RUN rm -rf src

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start:prod"]
