FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=17.3.0
ENV PHP_VERSION=php8.1
ENV PV=${PHP_VERSION}

WORKDIR /root

RUN apt-get -y update && apt-get -y upgrade &&\
    apt-get install -y software-properties-common curl

# PHP / MySQL
RUN add-apt-repository -y ppa:ondrej/php && apt-get -y update &&\
    apt-get install -y ${PV} ${PV}-mysql ${PV}-curl ${PV}-gd ${PV}-mbstring ${PV}-xml ${PV}-zip ${PV}-fileinfo php-pcov &&\
    apt-get install -y mysql-server=8.0.29-0ubuntu0.22.04.2

# Node
RUN curl -LO https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz &&\
    tar -xvf node-v${NODE_VERSION}-linux-x64.tar.xz

ENV NODE_DIR=/root/node-v${NODE_VERSION}-linux-x64/bin

# Composer
COPY composer.sh composer.sh
RUN chmod +x composer.sh && ./composer.sh
ENV COMPOSER_BIN=/root/composer.phar

# Linking
RUN ln -s ${COMPOSER_BIN} /usr/local/bin/composer &&\
    ln -s ${NODE_DIR}/node /usr/local/bin/node &&\
    ln -s ${NODE_DIR}/npm /usr/local/bin/npm &&\
    ln -s ${NODE_DIR}/corepack /usr/local/bin/corepack &&\
    corepack enable && yarn set version berry
