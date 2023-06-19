#!/usr/bin/env bash
docker run -d --name ambackendb \
	-e MONGO_INITDB_ROOT_USERNAME=mgadmin \
	-e MONGO_INITDB_ROOT_PASSWORD=Password1 \
	-e MONGO_INITDB_DATABASE=ambackendb \
	-v "$(pwd)/initializer:/docker-entrypoint-initdb.d" \
	-p 27088:27017 \
	mongo:6.0