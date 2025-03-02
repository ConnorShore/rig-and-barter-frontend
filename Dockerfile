FROM node:22 AS build


WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildProd

FROM nginx:alpine

COPY --from=build /app/dist/rb /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf