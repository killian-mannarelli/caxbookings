# docker/nginx/Dockerfile
FROM nginx:1-alpine

COPY docker/nginx/dev.conf /etc/nginx/conf.d/default.conf

EXPOSE 8090

RUN mkdir -p /appfiles/media \
	&& mkdir -p /appfiles/static \
	&& chmod 777 /appfiles/media \
	&& chmod 755 /appfiles/static


