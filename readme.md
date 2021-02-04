## Get Started

1. Creer une DB postgres nommée 'localhub' (le .env est configuré pour qu'il n'y est pas de owner, peut ne pas fonctionner selon vos paramêtres postgres)

```
$ psql
    CREATE DATABASE localhub;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

2. Importer le schéma de la DB & les seeds

```
psql -d localhub -f data/init.sql 
```

3. Installer les dépendances

```
npm install
```

4. Lancer l'appli back

```
npm run dev
```

5. Executer les requêtes précédées par `#OK ...`


