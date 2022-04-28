FROM node:16.9.0-alpine as BASE

WORKDIR /usr/src/app

COPY ./ ./

RUN npm i -g lerna
RUN lerna bootstrap
RUN lerna run build

FROM node:16.9.0-alpine as PUBLISHER
WORKDIR /usr/src/app
COPY --from=BASE /usr/src/app/packages/publisher/dist ./dist
COPY --from=BASE /usr/src/app/packages/publisher/package* ./
COPY --from=BASE /usr/src/app/packages/publisher/node_modules ./node_modules
CMD ["npm", "run","start:prod"]
