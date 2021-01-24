const { gql } = require('apollo-server-express');

const schema = gql`
# Les lignes qui commencent par # ou " sont des commentaires

# Ceci est le schéma de représentation de nos données.
# Il va servir de structure à notre API GraphQL

# On va commencer par définir des "entités"



type Project {
    # Chaque propriété à un nom et un type
    # On peut rajouter à un type un modificateur
    id: ID! # Le modificateur ! indique que cette donnée est NOT NULL

    created_at: String!

    updated_at: String!
    
    expiration_date: String!

    title: String!

    description: String!

    location: String!

    lat: Float!

    long: Float!

    image: String

    file: String

    archived: Boolean

    author: User

    needs: [Need]

    comments: [Comment]
}

type User {
    id: ID!

    name: String!

    email: String!

    password: String!

    avatar: String

    projects: [Project]

    activated: Boolean

    errors: String
}

type Need {
    id: ID!

    title: String!

    description: String!

    completed: Boolean

    project: Project
}

type Comment {
    id: ID!

    content: String!

    author: User

    project: Project
}

type Payload {
    infos: String
    errors: String
}

# On finit notre schéma par un type spécial
# Le type Query
# Il s'agirat des "points d'entrées" pour demander des données

type Query {

    project(id: ID!): Project
    projectsByGeo(lat: Float!, long: Float!, scope: Float!, archived: Boolean): [Project]
    projects: [Project]

    user(id: ID!): User
    users: [User]
    login(email: String!, password: String!): User

    comment(id: ID!): Comment
    comments: [Comment]

    need(id: ID!): Need
    needs: [Need]


}

# Les mutations sont les requêtes d'écriture (Création, modification, suppression) de GraphQL
type Mutation {

    insertUser(
        name: String!,
        email: String!,
        password: String!
    ): User

    editUserInfos(
        name: String!,
        email: String!,
    ): User

    editUserAvatar(
        avatar: String!
    ): User

    editUserPassword(
        password: String!
    ): User

    deleteUser: Payload

    insertProject(
        title: String!,
        description: String!,
        expiration_date: String!,
        location: String!,
        lat: Float!,
        long: Float!,
        image: String,
        file: String,
        author: ID!
    ): Project

    editProject(
        id: ID!,
        title: String!,
        description: String!,
        expiration_date: String!,
        location: String!,
        lat: Float!,
        long: Float!,
        image: String,
        file: String
    ): Project

    deleteProject(id: ID!): Payload

}
`;

// Le schéma a vraiment un role central dans les API GraphQL
// Car il sert à la fois
// - De documentation
// - De routeur
// - De validation

module.exports = schema;