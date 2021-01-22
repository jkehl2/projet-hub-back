const { gql } = require('apollo-server-express');

const schema = gql`
# Les lignes qui commencent par # ou " sont des commentaires

# Ceci est le schéma de représentation de nos données.
# Il va servir de structure à notre API GraphQL

# On va commencer par définir des "entités"

"""
Un post sur le blog
"""
type Post {
    # Chaque propriété à un nom et un type
    # On peut rajouter à un type un modificateur
    id: ID! # Le modificateur ! indique que cette donnée est NOT NULL

    "Technical name for URL"
    slug: String!

    title: String!

    excerpt: String

    content: String

    # Je vais pouvoir décrire des liens entre mes entités
    category: Category!

    author: Author
}

"""
Une categorie regroupant plusieurs posts
"""
type Category {
    id: ID!

    label: String!

    route: String!

    posts: [Post]
    # Le modificateur [] indique que c'est une liste d'item de type Post
}

type Author {
    id: ID!

    name: String!

    posts: [Post]
}

type Project {
    # Chaque propriété à un nom et un type
    # On peut rajouter à un type un modificateur
    id: ID! # Le modificateur ! indique que cette donnée est NOT NULL

    created_at: String!

    updated_at: String!
    
    expiration_date: String!

    "Technical name for URL"
    title: String!

    description: String!

    location: String!

    lat: Float!

    long: Float!

    image: String

    file: String

    archived: Boolean

    # Je vais pouvoir décrire des liens entre mes entités

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
    msg: String!
}

# On finit notre schéma par un type spécial
# Le type Query
# Il s'agirat des "points d'entrées" pour demander des données

type Query {
    "Renvoi toutes les categories du sites"
    categories: [Category]

    "Revoi un post par son ID"
    post(id: ID!): Post

    category(id: ID!): Category

    author(id: ID!): Author

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
    # Les mutations renvoient aussi des données
    insertPost(
        slug: String!, 
        title: String!, 
        category_id: ID!,
        author_id: ID
    ): Post
    # Il est possible de définir un type custom pour éviter de passer tt les param. un à un
    # https://graphql.org/graphql-js/mutations-and-input-types/


    editPost(
        id: ID!, 
        slug: String!, 
        title: String!, 
        content: String!, 
        category_id: ID!,
        author_id: ID
    ): Post

    insertUser(
        name: String!,
        email: String!,
        password: String!
    ): User

    editUserInfos(
        id: ID!,
        name: String!,
        email: String!,
    ): User

    editUserAvatar(
        id: ID!,
        avatar: String!
    ): User

    editUserPassword(
        id: ID!,
        password: String!
    ): User

    deleteUser(id: ID!): Payload

}
`;

// Le schéma a vraiment un role central dans les API GraphQL
// Car il sert à la fois
// - De documentation
// - De routeur
// - De validation

module.exports = schema;