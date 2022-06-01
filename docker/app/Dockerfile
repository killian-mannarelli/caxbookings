# docker/app/Dockerfile
FROM python:3.8-alpine

LABEL maintainer="Mannarelli Killian"

ENV PYTHONUNBUFFERED=1 \
  PROJECT_DIR=/app/
COPY . ${PROJECT_DIR}
COPY  docker/app/ /temp
COPY CAxBooking_django_react/static /static 

RUN mv /temp/entrypoint.sh . \
  && chmod 755 entrypoint.sh



WORKDIR ${PROJECT_DIR}
EXPOSE 8000 8080

RUN apk add --update --no-cache --virtual .tmp \
        python3-dev build-base linux-headers pcre-dev \
        jpeg-dev zlib-dev \
        libffi-dev libressl-dev rust cargo \
        mariadb-dev \
    && pip install --no-cache-dir pipenv \
    && pipenv install --system --deploy \
    && pipenv --clear \
    && find /usr/local \
        \( -type d -a -name test -o -name tests \) \
        -o \( -type f -a -name '*.pyc' -o -name '*.pyo' \) \
        -exec rm -rf '{}' + \
    && runDeps="$( \
        scanelf --needed --nobanner --recursive /usr/local \
                | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
                | sort -u \
                | xargs -r apk info --installed \
                | sort -u \
    )" \
    && apk add --virtual .rundeps $runDeps \
    && apk del .tmp \
    && adduser -D django 


USER django

ENTRYPOINT ["sh", "/entrypoint.sh"]
WORKDIR ${PROJECT_DIR}/CAxBooking_django_react
CMD ["uwsgi", "--http", "0.0.0.0:8080", "--master", "--enable-threads", "--module", "CAxBooking_django_react.wsgi"]
