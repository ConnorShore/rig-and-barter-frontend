FROM node:22 AS build

ARG CONFIG=dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build_${CONFIG}

FROM nginx:alpine

ARG CONFIG=dev

COPY --from=build /app/dist/rb /usr/share/nginx/html
COPY /nginx/${CONFIG}/nginx.conf /etc/nginx/conf.d/default.conf