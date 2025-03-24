# Test task

## Description

[Task requirements](./task.md)

The API provides 4 endpoints to work with objects on S3:

- Create: `/api/v1/objects/:id`
- Update: `/api/v1/objects/:id`
- GetById: `/api/v1/objects/:id`
- DeleteById: `/api/v1/objects/:id`

Details:

- Create = Update (the logic is the same)
- Objects are uploaded and fetched in a streaming fashion

## Run

```
cp .env.example .env
```

Fill in env variables.

### Local

```
npm i;
npm start
```

### Docker

```
docker build -t os-s3-media-api .
```

## Test

```
node ./test/main.test.js
```
