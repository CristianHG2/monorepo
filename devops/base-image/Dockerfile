FROM ubuntu:22.04

ENV NODE_VERSION=17.3.0
ENV PHP_VERSION=php8.1

ENV DEBIAN_FRONTEND=noninteractive

ENV NODE_DIST=node-v${NODE_VERSION}-linux-x64
ENV PV=${PHP_VERSION}

ENV HOME=/root
ENV NODE_BIN=$HOME/$NODE_DIST/bin
ENV COMPOSER_BIN="$HOME/.config/composer/vendor/bin"
ENV COMPOSER_HOME="$HOME/.config/composer"

WORKDIR $HOME

COPY installers/composer.sh composer.sh
COPY installers/bootstrap.sh bootstrap.sh

COPY supports lva

RUN chmod +x *.sh && chmod +x ./lva/*.sh

RUN apt-get -y update && apt-get -y upgrade &&\
    apt-get install -y software-properties-common curl

# PHP / MySQL
RUN add-apt-repository -y ppa:ondrej/php && apt-get -y update &&\
    apt-get install -y git unzip openssl 7zip &&\
    apt-get install -y ${PV}-common ${PV}-bcmath ${PV}-curl ${PV}-mbstring ${PV}-xml ${PV}-mysql ${PV}-pcov ${PV}-gd ${PV}-zip &&\
    apt-get install -y mysql-server=8.0.29-0ubuntu0.22.04.2

# Test Database
RUN service mysql start &&\
    mysql -e "CREATE USER 'test' IDENTIFIED BY 'test';" &&\
    mysql -e "GRANT ALL PRIVILEGES ON *.* TO 'test'; FLUSH PRIVILEGES;" &&\
    mysql -u test -ptest -e "CREATE DATABASE test;"

# Node and Composer
RUN curl -LO https://nodejs.org/dist/v${NODE_VERSION}/${NODE_DIST}.tar.xz &&\
    tar -xvf ${NODE_DIST}.tar.xz &&\
    rm ${NODE_DIST}.tar.xz &&\
    sh composer.sh

# Run bootstrap before installing packages
RUN sh bootstrap.sh

# Prepare composer
RUN corepack enable && yarn set version berry

# Set environment variables
ENV PATH="$NODE_BIN:$COMPOSER_BIN:$PATH"

# Install Laravel Pint and Prettier
RUN composer global require laravel/pint && \
    npm install -g prettier

# Export ENV for unit tests
ENV DB_USERNAME=test
ENV DB_PASSWORD=test
ENV DB_DATABASE=test
ENV DB_HOST=127.0.0.1
ENV DB_CONNECTION=mysql

