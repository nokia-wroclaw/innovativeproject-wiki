# =========BUILD==========
FROM node:14.1-alpine AS builder

WORKDIR /opt/web
COPY package.json package-lock.json ./

RUN rm -rf node_modules
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./

RUN npm run build

# ========= RUN =========
FROM abiosoft/caddy:1.0.3

COPY Caddyfile /etc/Caddyfile
COPY --from=builder /opt/web/build /usr/share/caddy/html


# Manual setup
# sudo docker build . -t frontend-image
# sudo docker run -p 3000:3000 --name frontend-container frontend-image:latest
