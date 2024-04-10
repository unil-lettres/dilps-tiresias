FROM php:8.2-apache-bullseye

ENV DOCKER_RUNNING=true

ENV NODE_VERSION=20
ENV YARN_VERSION=1.22
ENV COMPOSER_VERSION=2.6

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
RUN docker-php-ext-configure gd --with-jpeg
RUN apt-get clean; docker-php-ext-install pdo pdo_mysql mysqli gettext zip gd calendar bcmath

# Imagick
RUN pecl install imagick

# Xdebug
# https://xdebug.org/docs/compat
RUN pecl install xdebug-3.2.0

# Activate php extensions
RUN docker-php-ext-enable imagick xdebug

# Install specific version of Composer
RUN curl --silent --show-error https://getcomposer.org/installer | php -- \
    --$COMPOSER_VERSION \
    --install-dir=/usr/local/bin --filename=composer

# Install specific version of Node
RUN mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends nodejs

# Install specific version of Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list &&\
    apt-get update &&\
    apt-get install -y --no-install-recommends yarn &&\
    yarn set version $YARN_VERSION

# Enable apache configurations & modules
COPY ./vhosts/* /etc/apache2/sites-available/
RUN a2enmod rewrite && \
    a2enmod expires && \
    a2enmod headers && \
    a2ensite dilps.conf && \
    a2ensite tiresias.conf && \
    a2dissite 000-default.conf

# Replace default crontab
ADD ./crontab /etc/crontab

# Copy supervisor configuration file
#
# docker exec <container-id> supervisorctl status
# docker exec <container-id> supervisorctl tail -f <service>
# docker exec <container-id> supervisorctl restart <service>
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Add the entrypoint script
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT [ "entrypoint.sh" ]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
