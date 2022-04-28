FROM mongo as curbo-dev-db-mongo
RUN mkdir log
RUN touch log/mongo.log
RUN chmod 777 log/mongo.log
COPY ./infra/db/mongo-dev.sh ./docker-entrypoint-initdb.d/
ENTRYPOINT ["bash","./docker-entrypoint-initdb.d/mongo-dev.sh"]