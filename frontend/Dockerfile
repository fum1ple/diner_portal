FROM node:22

ENV TZ=Asia/Tokyo

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install 

COPY . /app

CMD ["yarn", "dev", "-p", "4000"]