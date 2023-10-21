FROM node:latest

WORKDIR /app

COPY . .
COPY .env .
RUN npm install

EXPOSE 3000

CMD ["node","dist/api.js"]
