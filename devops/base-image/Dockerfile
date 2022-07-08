FROM ubuntu:22.04

ENV NODE_VERSION=17.3.0
ENV PHP_VERSION=php8.1

ENV DEBIAN_FRONTEND=noninteractive

ENV NODE_DIST=node-v${NODE_VERSION}-linux-x64
ENV PV=${PHP_VERSION}

ENV HOME=/root
ENV NODE_BIN=$HOME/$NODE_DIST/bin
ENV COMPOSER_BIN="$HOME/.config/composer/vendor/bin"

WORKDIR $HOME

RUN apt-get -y update && apt-get -y upgrade &&\
    apt-get install -y software-properties-common curl

# PHP / MySQL
RUN add-apt-repository -y ppa:ondrej/php && apt-get -y update && \
    apt-get install -y git unzip &&\
    apt-get install -y ${PV} ${PV}-mysql ${PV}-curl ${PV}-gd ${PV}-mbstring ${PV}-xml ${PV}-zip ${PV}-fileinfo php-pcov &&\
    apt-get install -y mysql-server=8.0.29-0ubuntu0.22.04.2

# Node
RUN curl -LO https://nodejs.org/dist/v${NODE_VERSION}/${NODE_DIST}.tar.xz &&\
    tar -xvf ${NODE_DIST}.tar.xz

# Prepare composer
COPY composer.sh composer.sh
RUN chmod +x composer.sh && ./composer.sh

# Link binaries
COPY bootstrap.sh bootstrap.sh
RUN chmod +x bootstrap.sh && ./bootstrap.sh
RUN corepack enable && yarn set version berry

# Set environment variables
ENV PATH="$NODE_BIN:$COMPOSER_BIN:$PATH"

# Install Laravel Pint and Prettier
RUN composer global require laravel/pint && \
    npm install -g prettier
