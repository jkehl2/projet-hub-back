## Get Started

1. Create a postgres 'localhub' DB

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
psql -d localhub -f data/init.sql 
```

4. Install npm dependencies

```
npm install
```

1. Create your .env using .env.example as template and define your database url. You can change other settings if necessary.


2. Start the app

```
npm run dev
```

7. (optionnal) Go to root URL to access documentation

```
http://localhost:3000/
```


