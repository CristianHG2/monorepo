FROM php-node-mysql

ENV PATH=${NODE_DIR}:/root/.config/composer/vendor/bin:${PATH}

# Install Laravel Pint
RUN composer global require laravel/pint

# Prettier
RUN npm install -g prettier
