# CS5200 Project 3: Career Insight with Redis
## How to find the required parts

A. The requirements document as a PDF: `design docs/Project 3_ Career Insights with Redis.pdf`, see the "update on Redis" section

B. The Definition of data structures used: `design docs/Project 3_ Career Insights with Redis.pdf`, see the "redis data structure" section

C. The code of your basic application: most changes are in `db/controller/position_cache.js`, which implemented the cache for positions

### Importing the data
In terminal

```mongoimport -d career_insight -c job_update mongodb://localhost:27017 data/job_update.json --jsonArray```

replace `job_update` to `users`, `positions`, and `applications` to import other data, you can also use the dump file to re-create the database

### Create the dump file

```mongodump --db your_database_name```


### Run the node application
```npm install``` 
```npm start```

and the application is running on http://localhost:3000/

### The CRUD operations

(UPDATE with Redis)

This application implemented CRUD operation for the positions table

The basic logic was to add a cache layer for the positions being displayed, all CRUD will first being cached and then go to Mongo for persistence

Feel free to try out!