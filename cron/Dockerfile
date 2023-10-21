FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN echo ' */2 * * * * node /app/dist/index.js 2>&1' >> /etc/crontabs/root

CMD ["/usr/sbin/crond", "-f"]
# RUN apk add --no-cache cron
# ENTRYPOINT sh -c "crontab cronjob.txt && crond -f -L /dev/stdout"