# tactics-api

### Install

```
npm install
```

### Start the server

```
// start postgres
docker run --name postgres -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=tactics -p 5432:5432  -d postgres

// start the api
npm start
```

### Example urls

See `app/routes/task.routes.js`

- http://localhost:8080/v1/tasks
- http://localhost:8080/v1/tasks/1

### Deal with postgres in a docker

```
docker logs postgres

docker container stop postgres

docker container rm postgres
```

### Docker

```
// build
docker build -t stevenriggs/tactics-api .

// run
docker run --name tactics-api -p 8081:8080 -d stevenriggs/tactics-api

// stop
docker stop tactics-api

// delete
docker rm tactics-api
```
