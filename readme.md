## Get Started

1. Install Redis
- on Windows: https://redislabs.com/ebook/appendix-a/a-3-installing-on-windows/a-3-2-installing-redis-on-window/
- on Ubuntu: https://tecadmin.net/install-redis-ubuntu/
- on Mac: https://gist.github.com/tomysmile/1b8a321e7c58499ef9f9441b2faa0aa8

2. Create a postgres 'localhub' DB

```
$ psql -U postgres
$ psql
    CREATE DATABASE localhub;
```

2. Install postgres extensions "uuid-ossp" & "pgcrypto" in your localhub database
```
$ psql -d localhub
$ localhub=#
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```


3. Import DB Schema with seeds

```
$ psql -d localhub -f data/init.sql 
```

4. Install npm dependencies

```
$ npm install
```

5. Create your .env using .env.example as template and define your database url. You can change other settings if necessary.

6. Start the app

```
$ npm run dev
```

7. (optionnal) Go to root URL to access documentation


http://localhost:3000/



