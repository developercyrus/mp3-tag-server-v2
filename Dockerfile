FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y curl git
RUN curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN apt-get install -y nodejs

RUN git clone https://github.com/developercyrus/mp3-tag-server
RUN cd mp3-tag-server

EXPOSE 3004
CMD ["node", "index.js"]

