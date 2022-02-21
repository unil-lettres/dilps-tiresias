FROM php:8.1-apache

# Add Yarn repository
RUN apt-get update &&\
    apt-get install -y --no-install-recommends gnupg &&\
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - &&\
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# Install additional packages
RUN apt-get update &&\
  apt-get install -y git nano zip unzip cron supervisor imagemagick webp libcurl4-openssl-dev libzip-dev libonig-dev libmagickwand-dev mariadb-client

# Install needed php extensions
RUN apt-get clean; docker-php-ext-install pdo pdo_mysql mysqli gettext zip gd calendar bcmath

# Imagick
RUN pecl install imagick
RUN docker-php-ext-enable imagick

# Install Composer
RUN curl --silent --show-error https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node & Yarn
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - &&\
    apt-get update &&\
    apt-get install -y --no-install-recommends nodejs &&\
    npm install --global gulp-cli yarn

# Enable apache configurations & modules
COPY ./vhosts/* /etc/apache2/sites-available/
RUN a2enmod rewrite && \
    a2enmod expires && \
    a2ensite dilps.conf && \
    a2ensite tiresias.conf && \
    a2dissite 000-default.conf

# Replace default crontab
ADD ./crontab /etc/crontab

# Copy supervisor configuration file
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
