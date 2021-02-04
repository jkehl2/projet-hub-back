## Get Started

1. Creer une DB postgres nommée 'localhub' (le .env est configuré pour qu'il n'y est pas de owner, peut ne pas fonctionner selon vos paramêtres postgres). 

```
$ psql
    CREATE DATABASE localhub;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
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

5. Create your .env using .env.example as template and modify config if necessary


6. Start the app

```
npm run dev
```

7. (optionnal) Go to root URL to access documentation

```
http://localhost:3000/
```


