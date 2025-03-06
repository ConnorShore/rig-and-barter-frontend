FROM node:22 AS build

ARG CONFIG=dev
ARG STRIPE_API_KEY=invalid_key

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN sed -i "s/__STRIPE_API_KEY__/${STRIPE_API_KEY}/g" src/environments/environment.${CONFIG}.ts

RUN npm run build_${CONFIG}

FROM nginx:alpine

ARG CONFIG=dev

COPY --from=build /app/dist/rb /usr/share/nginx/html
COPY /nginx/${CONFIG}/nginx.conf /etc/nginx/conf.d/default.conf