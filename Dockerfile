FROM alpine:edge

RUN cat /etc/apk/repositories

# add testing repo for shapely support
# thanks to https://forum.alpinelinux.org/forum/installation/apk-add-error-unsatisfiable-constraints-geos-missing
RUN echo "http://nl.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

# update alpine linux package manager
RUN echo "ipv6" >> /etc/modules
RUN apk update

# basic flask environment
RUN apk add --no-cache bash git nginx uwsgi uwsgi-python3 \
	&& pip3 install --upgrade pip \
	&& pip3 install flask

# for psycopg2
RUN apk add --no-cache postgresql-dev gcc python3-dev musl-dev

# for shapely
RUN apk add --no-cache geos-dev

# For redis
RUN apk add --no-cache redis

# For uWSGI
RUN apk add linux-headers

# For Pillow
RUN apk add --no-cache jpeg-dev zlib-dev

# expose web server ports
EXPOSE 443
EXPOSE 80
EXPOSE 8000

# application folder
ENV APP_DIR /backend

# app dir
RUN mkdir ${APP_DIR} \
	&& chown -R nginx:nginx ${APP_DIR} \
	&& chmod 777 /run/ -R \
	&& chmod 777 /root/ -R
VOLUME ${APP_DIR}
WORKDIR ${APP_DIR}

# copy config files into filesystem
COPY nginx.conf /etc/nginx/nginx.conf
COPY uwsgi.ini /uwsgi.ini
COPY entrypoint.sh /entrypoint.sh

# exectute start up script
ENTRYPOINT ["/entrypoint.sh"]
