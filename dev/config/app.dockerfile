FROM php:8.5-fpm-trixie

ENV DOCKER_RUNNING=true
ENV COREPACK_ENABLE_AUTO_PIN=0

ENV NODE_VERSION=22
ENV PNPM_VERSION=11.0.1
ENV COMPOSER_VERSION=2.8.12

# Install additional packages
RUN apt-get update &&\
  apt-get install -y \
    git \
    nano \
    zip \
    unzip \
    cron \
    supervisor \
    imagemagick \
    webp \
    libcurl4-openssl-dev \
    libzip-dev \
    libonig-dev \
    libmagickwand-dev \
    mariadb-client \
    ca-certificates \
    gnupg

# Install needed php extensions
RUN docker-php-ext-configure gd --with-jpeg && \
    apt-get clean && \
    docker-php-ext-install pdo pdo_mysql mysqli gettext zip gd calendar bcmath && \
    pecl install xdebug-3.5.0 imagick-3.8.1 && \
    docker-php-ext-enable xdebug imagick

# Install specific version of Composer
RUN curl --silent --show-error https://getcomposer.org/installer | php -- \
    --version=$COMPOSER_VERSION \
    --install-dir=/usr/local/bin --filename=composer

# Install specific version of Node & pnpm
RUN mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends nodejs && \
    corepack enable && \
    corepack prepare pnpm@$PNPM_VERSION --activate && \
    pnpm --version

# Replace default crontab
ADD ./crontab /etc/crontab

# Copy supervisor configuration file
#
# docker exec <container-id> supervisorctl status
# docker exec <container-id> supervisorctl tail -f <service>
# docker exec <container-id> supervisorctl restart <service>
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy php-fpm healthcheck script (used for app container healthcheck)
COPY ./healthcheck-php-fpm.sh /usr/local/bin/healthcheck-php-fpm.sh
RUN chmod +x /usr/local/bin/healthcheck-php-fpm.sh

# Add the entrypoint script
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh" ]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
