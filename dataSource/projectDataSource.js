const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');
const cache = require('./cache');
const geolib = require('geolib');

class ProjectDataSource extends DataSource {

    constructor() {
        super();
    }

    // Dans la DataSource on doit obligatoirement implémenter une méthode
    // initialize qui sera appelé par notre serveur apollo pour faire de
    // "l'injection de dépendance"
    initialize(config) {
        // config contiendra 2 propriété
        // - context qui servira à faire passer les dépendances
        // - cache pour la gestion interne
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllProjects() {
        const result = await this.client.query('SELECT * FROM projects');
        return result.rows;
    }

    async findProjectById(projectId) {
        const result = await this.client.query('SELECT * FROM projects WHERE id = $1', [projectId]);

        if (result.rowCount === 0) {
            return undefined;
        }

        return result.rows[0];
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





}

module.exports = ProjectDataSource;