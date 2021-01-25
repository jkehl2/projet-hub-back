
module.exports = {
    Query: {
    
        async projects(_, __, context) {
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

        async favorite(_, args, context) {
            return await context.dataSources.favorite.findFavoriteById(args.id);
        },


    },

    Mutation: {
        async insertUser(_, args, context) {
            return await context.dataSources.user.insertUser(args);
        },

        async editUserInfos(_, args, context) {
            if (!context.user) 
                throw "user edit requires authentification";
            else
                return await context.dataSources.user.editUserInfos(args, context.user);
        },

        async editUserAvatar(_, args, context) {
            if (!context.user) 
                throw "user edit requires authentification";
            else
                return await context.dataSources.user.editUserAvatar(args, context.user);
        },

        async editUserPassword(_, args, context) {
            if (!context.user) 
                throw "user edit requires authentification";
            else
                return await context.dataSources.user.editUserPassword(args, context.user);
        },

        async deleteUser(_, args, context) {
            if (!context.user) 
                return {errors: "user deletion requires authentification"};
            else
                return await context.dataSources.user.deleteUser(context.user);
        },

        async insertProject(_, args, context) {
            return await context.dataSources.project.insertProject(args);
        },

        async editProject(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else
                return await context.dataSources.project.editProject(args, context.user);
        },

        async deleteProject(_, args, context) {
            if (!context.user) 
                return {errors: "project deletion requires authentification"};
            else
                return await context.dataSources.project.deleteProject(args.id, context.user);
        },

        async insertNeed(_, args, context) {
                if (!context.user) 
                    throw "project edit requires authentification";
                else
                return await context.dataSources.need.insertNeed(args, context.user);
        },

        async editNeed(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else
                return await context.dataSources.need.editNeed(args, context.user);
        },

        async deleteNeed(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else
                return await context.dataSources.need.deleteNeed(args, context.user);
        },

        async insertFavorite(_, args, context) {
            if (!context.user) 
                throw "favorite creation requires authentification";
            else
                return await context.dataSources.favorite.insertFavorite(args.project_id, context.user);
        },
        
        async deleteFavorite(_, args, context) {
            if (!context.user) 
                throw "favorite deletion requires authentification";
            else
                return await context.dataSources.favorite.deleteFavorite(args.project_id, context.user);
        },

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

        async followers(project, _, context) {
            const projectId = project.id;
            return await context.dataSources.favorite.findFavoritesByProjectId(projectId);
        },
    },

    User: {
        async projects(user, _, context) {
            const userId = user.id;
            return await context.dataSources.project.findProjectsByAuthorId(userId);
        },

        async favorites(user, _, context) {
            const userId = user.id;
            return await context.dataSources.favorite.findFavoriteProjectsByUserId(userId);
        }
    },

    Need: {
        async project(need, _, context) {
            const projectId = need.project_id;
            return await context.dataSources.project.findProjectById(projectId);
        }
    },

    Comment: {
        async project(comment, _, context) {
            const projectId = comment.project_id;
            return await context.dataSources.project.findProjectById(projectId);
        },
        async author(project, _, context) {
            return await context.dataSources.user.findUserById(project.author);
        },

    },

    Favorite: {
        async project(favorite, _, context) {
            const projectId = favorite.project_id;
            return await context.dataSources.project.findProjectById(favorite.project_id);
        },
        async user(favorite, _, context) {
            return await context.dataSources.user.findUserById(favorite.user_id);
        },
    },
}