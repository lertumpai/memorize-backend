FROM node:lts

ARG KEY_JSON_PATH
ENV KEY_JSON_PATH=$KEY_JSON_PATH
RUN echo $KEY_JSON_PATH

# set a directory for the app
WORKDIR /usr/src/memorize-backend

# copy all the files to the container
COPY package.json /usr/src/memorize-backend

RUN npm install

COPY . /usr/src/memorize-backend
COPY $KEY_JSON_PATH /usr/src/memorize-backend

# build file (transpile to nodejs current version)
RUN npm run build
RUN npm prune --production

# remove floder src
RUN rm -rf src

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start:prod"]
