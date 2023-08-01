FROM docker.io/node:14-buster



COPY . /app


# Create and define the node_modules's cache directory.
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./
RUN npm install


RUN mkdir /usr/src/app

WORKDIR /usr/src/app
# RUN rm -rf node_modules
# COPY package.json . 
# COPY package-lock.json .

# RUN npm install 
RUN echo "DONE"
COPY . . 

RUN ["chmod", "+x", "/usr/src/app/entrypoint.sh"]

