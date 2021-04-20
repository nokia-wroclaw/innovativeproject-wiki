FROM node:14-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

FROM caddy:2-alpine

WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/build /var/www/html

# Manual setup
# sudo docker build . -t frontend-image
# sudo docker run -p 3000:3000 --name frontend-container frontend-image:latest
