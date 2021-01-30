const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');
const cache = require('./cache');
const geolib = require('geolib');
const timestampConverter = require('./timestampConverter')

class ProjectDataSource extends DataSource {

    constructor() {
        super();
    }

    initialize(config) {
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllProjects(user) {
        const data = await this.client.query('SELECT * FROM projects');
        timestampConverter.toIso(data.rows);

        await this.defineUserRelation(data.rows, user);

        return data.rows;
    }

    async findProjectById(projectId, user) {
        const cacheKey = "projectById"+ projectId.toString();
        const project = await cache.wrapper(cacheKey,async () => {
            await this.projectLoader.clear(projectId)
            return await this.projectLoader.load(projectId);
        });

        await this.defineUserRelation([project], user);

        return project;
    }

    async findProjectsByGeo(lat, long, scope, archived, user) {
        const cacheKey = `projectByGeo:${lat.toString()}|${long.toString()}|${scope}|${archived}`;
        const results = await cache.wrapper(cacheKey,async () => {
            const [geoMin, geoMax] = geolib.getBoundsOfDistance(
                {latitude: lat, longitude: long},
                scope
            )
            const data = await this.client.query(`SELECT * FROM projects 
            WHERE lat > $1
            AND long > $2
            AND lat < $3 
            AND long < $4
            AND (archived = $5
            OR archived = FALSE)
            `, [
                geoMin.latitude,
                geoMin.longitude, 
                geoMax.latitude, 
                geoMax.longitude,
                archived
            ]);
            timestampConverter.toIso(data.rows);
            return data.rows
        })
        await this.defineUserRelation(results, user);
        return results;
    }

    async findProjectsByAuthorId(authorId, user) {
        const cacheKey = "projectsByAuthor"+ authorId.toString();
        const results = await cache.wrapper(cacheKey,async () => {
            await this.projectsByAuthorLoader.clear(authorId);
            return await this.projectsByAuthorLoader.load(authorId);
        });

        await this.defineUserRelation(results, user);

        return results;
    }

    async insertProject(project, user) {
        try{
            const insertion = await this.client
                .query(`
                    INSERT INTO projects(
                        title, 
                        description, 
                        expiration_date, 
                        location, 
                        lat, 
                        long, 
                        image, 
                        file, 
                        author)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                    RETURNING *`,
                    [project.title, project.description, project.expiration_date, project.location, project.lat, project.long, project.image, project.file, user.id])
                .catch(error => {throw {msg:error.stack,code:error.code}})

            timestampConverter.toIso(insertion.rows);

            await this.defineUserRelation(insertion.rows, user);

            return insertion.rows[0];
        } catch (error){
            return{error: error}
        };
    }

    async editProject(project, user) {
        try{
            const projectToUpdade = await this.findProjectById(project.id);
            if (!projectToUpdade)
                throw {msg:"project to update not found", code:"whatever"};

            if (projectToUpdade.author != user.id)
                throw {msg:"User is not author, project editing not allowed", code: "whatever"};
            
            const update = await this.client
                .query(`
                    UPDATE projects
                    SET 
                        title = $1, 
                        description = $2, 
                        expiration_date = $3, 
                        location = $4, 
                        lat = $5, 
                        long = $6, 
                        image = $7, 
                        file = $8
                    WHERE id = $9
                    RETURNING *`,
                    [project.title, project.description, project.expiration_date, project.location, project.lat, project.long, project.image, project.file, project.id])
                .catch(error => {throw {msg:error.stack,code:error.code}})
            
                timestampConverter.toIso(update.rows);

            await this.defineUserRelation(update.rows, user);
            
            const updatedProject = update.rows[0]

            return updatedProject;    
        } catch(error) {
            return{error: error}
        }
    };

    async archiveProject(project, user) {
        try{
            const projectToArchive = await this.findProjectById(project.id);
            if (!projectToArchive)
                throw {msg:"project to archive not found", code:"whatever"};

            if (projectToArchive.author != user.id)
                throw {msg:"User is not author, project archiving not allowed", code: "whatever"};
            
            const update = await this.client
                .query(`
                    UPDATE projects
                    SET 
                        archived = true
                    WHERE id = $1
                    RETURNING *`,
                    [project.id])
                .catch(error => {throw {msg:error.stack,code:error.code}})
            
                timestampConverter.toIso(update.rows);

            await this.defineUserRelation(update.rows, user);
            
            const updatedProject = update.rows[0]

            return updatedProject;    
        } catch(error) {
            return{error: error}
        }
    };

    async deleteProject(projectId, user) {
        try{
            const project = await this.findProjectById(projectId);
            if (!project)
                throw {msg: "Project to delete not found", code: 11};

            if (project.author != user.id)
                throw {msg: "Current user is not author, deletion not allowed", code:10};
            
            const deletion = await this.client
            .query(`
                DELETE FROM projects
                WHERE
                    id = $1
                RETURNING *
                 `,
                [projectId])
            .catch(error => {throw {msg:error.stack,code:error.code}})

            return deletion.rows[0];
        } catch(error) {
            return{error: error}
        }
    };


    projectLoader = new DataLoader(async (ids) => {
        console.log('Running batch function project Loader with', ids);
        const result = await this.client.query(
            'SELECT * FROM projects WHERE id = ANY($1)',
            [ids]);
            
        const data = ids.map(id => {
            return result.rows.find( project => project.id == id);
        });

        timestampConverter.toIso(data);
        return data;
    });

    projectsByAuthorLoader = new DataLoader(async (ids) => {

        console.log('Running batch function projectsByAuthor with', ids);

        const result = await this.client.query(
            'SELECT * FROM projects WHERE author = ANY($1)',
            [ids]);
        const data = ids.map(id => {
               return result.rows.filter( project => project.author == id);
        });
        console.log(data[0])
        timestampConverter.toIso(data[0]);

      return data;
    });

    async defineUserRelation(projects, user){
        if(projects[0]!== undefined){
            if (user !== undefined){
                const favorites = await this.findFavoritesByUserId(user.id);
                const projectsIds = favorites.map(favorite => favorite.project_id)
                projects.forEach(project => {
                    if (projectsIds.includes(project.id)){
                        project.isFollowed = true;
                    } else {
                        project.isFollowed = false;
                    }
                    if (project.author === user.id){
                        project.userIsAuthor = true;
                    } else {
                        project.userIsAuthor = false;
                    }
                });
            } else {
                projects.forEach(project => {
                    project.isFollowed = false;
                    project.userIsAuthor = false;
                })
            }
        }
    };
    async findFavoritesByUserId(userId) {
        const cacheKey = "favoritesByUser"+ userId.toString();
        return cache.wrapper(cacheKey,async () => {
            const result = await this.client.query(
                'SELECT * FROM favorites WHERE user_id = $1',
                [userId]);
            const favorites = result.rows;

            return favorites;
        });
    }

}

module.exports = ProjectDataSource;