FROM node:20

WORKDIR /usr/src/app

# Copy File

COPY . .

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start:dev"]