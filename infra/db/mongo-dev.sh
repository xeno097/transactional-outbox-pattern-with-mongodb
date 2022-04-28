# Inits the mongod instance with replication configured because change stream are supported only in replica set and sharded clusters
mongod --bind_ip 0.0.0.0 --port 27017 --fork --replSet transactional-outbox --logpath /log/mongo.log --logappend

# Connects to the running mongo instance to load the replicaset default config
mongo --eval "rs.initiate()"

# Attaches the docker container shell to the logs of the running mongo instance to avoid the container termination
tail -f /log/mongo.log
