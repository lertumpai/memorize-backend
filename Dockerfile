FROM node:lts

ARG GCP_SA_KEY
ENV GCP_SA_KEY=$GCP_SA_KEY

# set a directory for the app
WORKDIR /usr/src/memorize-backend

# copy all the files to the container
COPY package.json /usr/src/memorize-backend

RUN npm install

COPY . /usr/src/memorize-backend

RUN echo $GCP_SA_KEY
RUN $GCP_SA_KEY > key.json

# build file (transpile to nodejs current version)
RUN npm run build
RUN npm prune --production

# remove floder src
RUN rm -rf src

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["npm", "run", "start:prod"]
