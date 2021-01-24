const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');
const cache = require('./cache');
const geolib = require('geolib');

class ProjectDataSource extends DataSource {

    constructor() {
        super();
    }

    initialize(config) {
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllProjects() {
        const result = await this.client.query('SELECT * FROM projects');
        return result.rows;
    }

    async findProjectById(projectId) {
        const cacheKey = "project"+ projectId.toString();
        return cache.wrapper(cacheKey,async () => {
            await this.projectLoader.clear(projectId)
            return await this.projectLoader.load(projectId);
        });
    }

    async findProjectsByGeo(lat, long, scope, archived) {
        const cacheKey = `projectByGeo:${lat.toString()}|${long.toString()}|${scope}|${archived}`;
        const results = await cache.wrapper(cacheKey,async () => {
            const [geoMin, geoMax] = geolib.getBoundsOfDistance(
                {latitude: lat, longitude: long},
                scope
            )
            const result = await this.client.query(`SELECT * FROM projects 
            WHERE lat > $1
            AND long > $2
            AND lat < $3 
            AND long < $4
            AND archived = $5
            `, [
                geoMin.latitude,
                geoMin.longitude, 
                geoMax.latitude, 
                geoMax.longitude,
                archived
            ]);
            return result
        })
        return results.rows;
    }

    async findProjectsByAuthorId(userId) {
        const cacheKey = "projectsByUser"+ userId.toString();
        return cache.wrapper(cacheKey,async () => {
            await this.projectsByAuthorLoader.clear(userId);
            return await this.projectsByAuthorLoader.load(userId);
        });

    }

    async insertProject(project) {
        const newProject = await this.client.query(
            `INSERT INTO projects
                (title, description, expiration_date, location, lat, long, image, file, author)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING *`,
            [project.title, project.description, project.expiration_date, project.location, project.lat, project.long, project.image, project.file, project.author]
             );
        return newProject.rows[0];
    };

    async editProject(project) {
        const newProject = await this.client.query(`
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
            [project.title, project.description, project.expiration_date, project.location, project.lat, project.long, project.image, project.file, project.id]
             );
        return newProject.rows[0];
    };

    async deleteProject(projectId, user) {
        try{
            const project = await this.findProjectById(projectId);
            console.log(project)
            if (!project)
                throw "project to delete not found";
            console.log(`trying deletetion project author ${project.author} with user id ${user.id}`)

            if (project.author != user.id)
                throw "Project deletion not allowed with this user profile";
            
            const deletion = await this.client.query(`
                DELETE FROM projects
                WHERE
                    id = $1
                RETURNING 'Deletion completed'
                 `,
                [projectId]
                 );
            return {infos: deletion.rows[0]['?column?']};
                } catch(error) {
            return {errors: error};
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
      return data;
    });



}

module.exports = ProjectDataSource;