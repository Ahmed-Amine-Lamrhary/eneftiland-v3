FROM node:16.14.0

RUN mkdir /eneftiland

WORKDIR /eneftiland

COPY . /eneftiland

RUN npm install

RUN npx prisma generate

RUN npm run build

CMD ["npm", "start"]