FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y curl git sudo
RUN curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get install -y nodejs npm

WORKDIR /app
COPY . /app
RUN npm install
ENV MUSIC=/music

EXPOSE 3004
CMD ["node", "index.js"]

