const { need } = require("./dataSource");

module.exports = {
    Query: {
    
        async projects(_, __, context) {
                return await context.dataSources.project.findAllProjects();
        },

        async project(_, args, context) {
            
            const project = await context.dataSources.project.findProjectById(args.id, context.user);
            
            // if (context.user){
            //     const favorites = await context.dataSources.favorite.findFavoritesByUserId(context.user.id);
            //     const projectsIds = favorites.map(favorite => favorite['project_id'])
            //     if (projectsIds.includes(project.id)){
            //         project.isFollowed = true;
            //     } else {
            //         project.isFollowed = false;
            //     }
            //     if (project.author === context.user.id){
            //         project.userIsAuthor = true;
            //     } else {
            //         project.userIsAuthor = false;
            //     }
                

            // } else {
            //     project.isFollowed = false;
            //     project.userIsAuthor = false;
            // }
            return project;
        },

        async projectsByGeo(_, args, context) {
            return await context.dataSources.project.findProjectsByGeo(args.lat,args.long, args.scope, args.archived, context.user);
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
            return {msg: "user deletion requires authentification"};
            else
                return await context.dataSources.user.editUserInfos(args, context.user);
        },

        // async editUserAvatar(_, args, context) {
        //     if (!context.user) 
        //         throw "user edit requires authentification";
        //     else
        //         return await context.dataSources.user.editUserAvatar(args, context.user);
        // },

        async editUserPassword(_, args, context) {
            if (!context.user) 
                return{error:{msg: context.error, code: context.code}}
            else
                return await context.dataSources.user.editUserPassword(args, context.user);
        },

        async deleteUser(_, args, context) {
            if (!context.user) 
                return {msg: "user deletion requires authentification"};
            else
                return await context.dataSources.user.deleteUser(context.user);
        },

        async insertProject(_, args, context) {
            if (!context.user) 
                throw "project creation requires authentification";
            else{
                const newProject = await context.dataSources.project.insertProject(args, context.user);
                for(const need of args.needs){
                    need.project_id = newProject.id;
                    newProject.needs =[];
                    newProject.needs.push(await context.dataSources.need.insertNeed(need, context.user))
                }
                return newProject;
            }
        },

        async editProject(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else{
                return await context.dataSources.project.editProject(args, context.user);
            }
        },
    

        async deleteProject(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else{
                return await context.dataSources.project.deleteProject(args.id, context.user);
            }
        },

        async insertNeeds(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else{
                const needsCreated =[];
                for(const need of args.needs){
                    needsCreated.push(await context.dataSources.need.insertNeed(need, context.user))
                }
                return needsCreated
            }
        },

        async editNeed(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else{
                return await context.dataSources.need.editNeed(args, context.user);
            }
        },

        async deleteNeed(_, args, context) {
            if (!context.user) 
                throw "project edit requires authentification";
            else{
                return await context.dataSources.need.deleteNeed(args, context.user);
            }
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
            const favorites = await context.dataSources.favorite.findFavoritesByProjectId(projectId);
            const followersIds = favorites.map(favorite => favorite['user_id'])
            const followers = [];
            for(const followerId of followersIds){
                followers.push(await context.dataSources.user.findUserById(followerId))
            };
            return followers;
        }
    },

    User: {
        async projectsCreated(author, _, context) {
            const authorId = author.id;
            return await context.dataSources.project.findProjectsByAuthorId(authorId, context.user);
        },

        async projectsFollowed(user, _, context) {
            const userId = user.id;
            const favorites = await context.dataSources.favorite.findFavoritesByUserId(userId);
            const projectsIds = favorites.map(favorite => favorite['project_id'])
            const projects = [];
            for(const projectId of projectsIds){
                projects.push(await context.dataSources.project.findProjectById(projectId))
            };
            return projects;
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
            return await context.dataSources.project.findProjectById(favorite.project_id, context.user);
        },
        async user(favorite, _, context) {
            return await context.dataSources.user.findUserById(favorite.user_id);
        },
    },

    UserResult: {
        __resolveType(obj, context, info){
            if(obj.id){
                return 'User';      
            }      
            if(obj.error){        
                return 'Error';      
            }      
            return null; // GraphQLError is thrown    },
        }
    }
}