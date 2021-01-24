BEGIN;

DROP TABLE IF EXISTS comments, needs, projects, users;


CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar TEXT NULL,
    activated BOOLEAN DEFAULT TRUE
);

INSERT INTO users (name, email, password) VALUES
('Michel','michel@michel', crypt('password1', gen_salt('md5'))),
('Bruce Reynolds','bruce@reynolds', crypt('password2', gen_salt('md5')));


CREATE TABLE projects (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    lat FLOAT NOT NULL,
    long FLOAT NOT NULL,
    image TEXT NULL,
    file TEXT NULL,
    archived BOOLEAN DEFAULT FALSE,
    author INT REFERENCES users(id)
);

INSERT INTO projects (expiration_date, title, description, location, lat, long, author) VALUES
('2001-09-28 01:00:00','projet test', 'ceci est un projet', 'Paris', 1.00000, 1.00000,1),
('2030-01-02 12:00:00','hold-up', 'braquer la banque du coin', 'Nantes', 2.00000, 2.00000, 2);

CREATE TABLE needs (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    project_id INT REFERENCES projects(id)
);


INSERT INTO needs (title, description, project_id) VALUES
('besoin test', 'ceci est un besoin', 1),
('un chauffeur', 'necessite un chauffeur avec véhicule vers 12h00', 2),
('armes automatiques', '2 armes automatiques avec munitions', 2);

CREATE TABLE comments (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    project_id INT REFERENCES projects(id),
    author INT REFERENCES users(id)
);

INSERT INTO comments (content, project_id, author) VALUES
('ceci est un commentaire', 1, 1),
('ca a lair bien, je peux venir avec ma ptite soeur?', 2, 1),
('oui par contre le repas nest pas assuré', 2, 2);


COMMIT;