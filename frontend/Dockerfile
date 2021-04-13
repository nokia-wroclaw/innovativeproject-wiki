FROM node:14.1-alpine AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./

RUN rm -rf node_modules
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./

# install curl
# RUN apk add curl
# # setup caddy
# RUN apk add -y debian-keyring debian-archive-keyring apt-transport-https
# RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | apt-key add -
# RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list
# RUN apt update
# RUN apt install caddy

RUN npm run build

FROM caddy:latest

COPY Caddyfile /etc/caddy/Caddyfile
# COPY site /srv
RUN caddy start

FROM nginx:1.17-alpine
RUN apk --no-cache add curl
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.1.0/envsubst-`uname -s`-`uname -m` -o envsubst && \
    chmod +x envsubst && \
    mv envsubst /usr/local/bin
COPY ./nginx.config /etc/nginx/nginx.template
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
COPY --from=builder /opt/web/build /usr/share/nginx/html


# Manual setup
# sudo docker build . -t frontend-image
# sudo docker run -p 3000:3000 --name frontend-container frontend-image:latest
