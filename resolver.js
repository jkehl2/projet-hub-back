
module.exports = {
    Query: {
    
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

        async insertProject(_, args, context) {
            return await context.dataSources.project.insertProject(args);
        },

        async editProject(_, args, context) {
            return await context.dataSources.project.editProject(args);
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
    },

    User: {
        async projects(user, _, context) {
            const userId = user.id;
            return await context.dataSources.project.findProjectsByAuthorId(userId);
        }
    },
}