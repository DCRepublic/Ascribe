FROM node:lts-bullseye
ARG DATABASE_URL
ENV NODE_ENV=production

RUN apt-get update
RUN apt-get install -y vim netcat-openbsd

WORKDIR /usr/src/app
COPY . .
EXPOSE 3000

RUN chown -R node /usr/src/app
USER node
RUN npm install
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
