
module.exports = {
    // On suit ici la structure du schéma
    // Mon schéma à un type query
    Query: {
        // Qui à une propriété "categories"
        // Pour lui "expliquer" comment répondre à cette demande je fais une fonction
        async categories(_, __, context) {
            return await context.dataSources.category.findAllCategories();
        },

        // Le second paramètre correspond aux arguments passé à mon point d'entrée
        async post(_, args, context) {
            return await context.dataSources.post.findPostById(args.id);
        },

        async category(_, args, context) {
            return await context.dataSources.category.findCategoryById(args.id);
        },

        async author(_, args, context){
            return await context.dataSources.author.findAuthorById(args.id);
        },

        async projects(_, __, context) {
            if (!context.user) 
                return null;
            else
                return await context.dataSources.project.findAllProjects();
        },

        async project(_, args, context) {
            return await context.dataSources.project.findProjectById(args.id);
        },

        async projectsByGeo(_, args, context) {
            return await context.dataSources.project.findProjectsByGeo(args.lat,args.long, args.scope, args.archived);
        },

        async user(_, args, context) {
            return await context.dataSources.user.findUserById(args.id);
        },

        async login(_, args, context) {
            return await context.dataSources.user.login(args);
        },

        async need(_, args, context) {
            return await context.dataSources.need.findNeedById(args.id);
        },

        async comment(_, args, context) {
            return await context.dataSources.comment.findCommentById(args.id);
        },


    },

    Mutation: {
        async insertPost(_, args, context) {
            return await context.dataSources.post.insertPost(args);
        },

        async editPost(_, args, context) {
            return await context.dataSources.post.editPost(args);
        },

        async insertUser(_, args, context) {
            return await context.dataSources.user.insertUser(args);
        },

        async editUserInfos(_, args, context) {
            return await context.dataSources.user.editUserInfos(args);
        },

        async editUserAvatar(_, args, context) {
            return await context.dataSources.user.editUserAvatar(args);
        },

        async editUserPassword(_, args, context) {
            return await context.dataSources.user.editUserPassword(args);
        },

        async deleteUser(_, args, context) {
            return await context.dataSources.user.deleteUser(args.id);
        },
    },

    Category: {
        // Le premier param des résolvers est le "parent"
        // Lorsque la requête demande les "posts" d'une "Category"
        // Apollo va venir exécuter ce resolver afin de les récupérer
        // Pour que le resolver récupère les posts de la bonne Category
        // il la passe en param en tant que "parent"
        async posts(category, _, context) {
            // parent ici est un objet Category
            // il a une propriété id
            const categoryId = category.id;
            return await context.dataSources.post.findPostsByCategoryId(categoryId);
        }
    },

    Post: {
        async category(post, _, context) {
            return await context.dataSources.category.findCategoryById(post.category_id);
        },

        async author(post, _, context) {
            return await context.dataSources.author.findAuthorById(post.author_id);
        }
    },

    Author: {
        async posts(author, _, context) {
            const authorId = author.id;
            return await context.dataSources.post.findPostsByAuthorId(authorId);
        }
    },

    Project: {
        
        async author(project, _, context) {
            return await context.dataSources.user.findUserById(project.author);
        },

        async needs(project, _, context) {
            const projectId = project.id;
            return await context.dataSources.need.findNeedsByProjectId(projectId);
        },

        async comments(project, _, context) {
            const projectId = project.id;
            return await context.dataSources.comment.findCommentsByProjectId(projectId);
        },
    },

    User: {
        async projects(user, _, context) {
            const userId = user.id;
            return await context.dataSources.project.findProjectsByAuthorId(userId);
        }
    },
}