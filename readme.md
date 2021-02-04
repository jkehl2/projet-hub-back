## Get Started

1. Create a postgres 'localhub' DB

```
$ psql
    CREATE DATABASE localhub;
```

2. Install extensions "uuid-ossp" & "pgcrypto" in your localhub database
```
$ localhub=#
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```


3. Import DB Schema with seeds

```
psql -d localhub -f data/init.sql 
```

4. Install npm dependancies

```
npm install
```

5. Create your .env using .env.example as template and define your postgres settings. You can change other settings if necessary.


6. Start the app

```
npm run dev
```

7. (optionnal) Go to root URL to access documentation

```
http://localhost:3000/
```


