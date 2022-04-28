FROM node:16.9.0-alpine as BASE

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i -g lerna
RUN lerna bootstrap
RUN lerna run build

FROM node:16.9.0-alpine as SUBSCRIBER
WORKDIR /usr/src/app
COPY --from=BASE /usr/src/app/packages/subscriber/dist ./dist
COPY --from=BASE /usr/src/app/packages/subscriber/package* ./
COPY --from=BASE /usr/src/app/packages/subscriber/node_modules ./node_modules
CMD ["npm", "run","start:prod"]
